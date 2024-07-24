/* 
                        REFER TERRAFORM OFFICIAL DOCUMENTATION


                        before running this script;
                        -> terraform init
                        -> terraform validate
                        -> terraform plan
                        -> terraform apply  /   terraform apply -auto-approve                   */

provider "aws" {
    region = "ap-south-1" // choose the region for the terraform deployement
  access_key = var.aws_access_key_id
  secret_key = var.aws_secret_access_key
}

variable "aws_access_key_id" {
  type = string
  sensitive = true
}

variable "aws_secret_access_key" {
  type = string
  sensitive = true
}

# 1. Create VPC

resource "aws_vpc" "vpc-chat" {
    cidr_block = "10.0.0.0/16"         
}

# 2. Create Internet Gateway

resource "aws_internet_gateway" "igw-chat"{
    vpc_id = aws_vpc.vpc-chat.id
    tags = {
        Name= "intgateway-chatapp"
    }
}

# 4. Create a Subnet

resource "aws_subnet" "subnet-chatapp-1" {
    vpc_id = aws_vpc.vpc-chat.id
    cidr_block = "10.0.1.0/24"
    availability_zone = "ap-south-1a"
    map_public_ip_on_launch = true
    tags = {
        Name = "subnet-chatapp"
    }
}

# 3. Create Custom Route Table

resource "aws_route_table" "route-chatapp" {
    vpc_id = aws_vpc.vpc-chat.id
    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.igw-chat.id
    }
    tags = {
        Name = "route_table_chatapp"
    }
}

# 5. Associate subnet with Route Table

resource "aws_main_route_table_association" "mainrt-chatapp"{
    vpc_id         = aws_vpc.vpc-chat.id
    route_table_id = aws_route_table.route-chatapp.id
}

# 6. Create Security Group to allow port 22,80,443

resource "aws_security_group" "allow_ports" {
    vpc_id         = aws_vpc.vpc-chat.id

    ingress {
        description = "HTTPS FROM VPC"
        protocol  = "tcp"
        from_port = 443
        to_port   = 443
        cidr_blocks = ["0.0.0.0/0"]
    }
        ingress {
        description = "HTTP FROM VPC"
        protocol  = "tcp"
        from_port = 80
        to_port   = 80
        cidr_blocks = ["0.0.0.0/0"]
    }
        ingress {
        description = "SSH FROM VPC"
        protocol  = "tcp"
        from_port = 22
        to_port   = 22
        cidr_blocks = ["0.0.0.0/0"]
    }   //dont forget to open your project port or docker host port
        ingress { 
        description = "Docker Compose Port"
        protocol = "tcp"
        from_port = 12345
        to_port = 12345
        cidr_blocks = ["0.0.0.0/0"]
        }

        egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
        ipv6_cidr_blocks = ["::/0"]
    }
    tags = {
        Name = "allow web"
    }
}

# 7. Create a network interface with an ip in the subnet that was created in step 4

# resource "aws_network_interface" "test" {
#     subnet_id       = aws_subnet.subnet-chatapp-1.id
#     private_ips     = ["10.0.1.10"]
#     security_groups = [aws_security_group.allow_ports.id]
# }

# # 8. Assign an elastic IP to the network interface created in step 7

# resource "aws_eip" "one" {
#     domain                    = "vpc"
#     network_interface         = aws_network_interface.test.id
#     associate_with_private_ip = "10.0.1.10"
#     depends_on = [aws_internet_gateway.igw-chat]
#     }

#Creating a key pair

resource "tls_private_key" "rsa" {
    algorithm = "RSA"
    rsa_bits  = 4096
    }


resource "aws_key_pair" "TF_key" {
    key_name   = "TF_key"
    public_key = tls_private_key.rsa_public_key_openssh
    }

resource "local_file" "TF_key" {
    content  = tls_private_key.rsa.private_key_pem
    filename = "TF_key.pem"
    }


# 9. Create Ubuntu server and install/git/docker

resource "aws_instance" "chatapp_server" {
    ami = "ami-0ad21ae1d0696ad58" // find correct AMI in the correct region
    instance_type = "t2.micro"
    availability_zone = "ap-south-1a"
    key_name = aws_key_pair.TF_key.key_name //created key from aws and saved it in directory

    associate_public_ip_address  = true
    subnet_id                    = aws_subnet.subnet-chatapp-1.id
    security_groups              = [aws_security_group.allow_ports.id]

    provisioner "file" {
        source = "/Users/directory/folder/script.sh"
        destination = "/home/ubuntu/script.txt"
    }

    provisioner "remote-exec" {
        inline = [
            "chmod +x script.txt",
            "./script.txt"
        ]
    }

    connection {
        type = "ssh"
        user = "ubuntu"
        private_key = file(local_file.TF_key.filename)
        host = self.public_ip
        timeout = "4m"
    }

    # user_data = <<-EOF
    # #!/bin/bash
    # chmod +x script.sh
    # ./script.sh
    # EOF

    tags = {
        Name = "Server-Web"
    }
}
