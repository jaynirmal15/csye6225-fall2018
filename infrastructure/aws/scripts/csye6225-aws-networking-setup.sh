#!/usr/bin/bash

# define variables
region=us-east-1
#vpc_cidr_block="20.0.0.0/16"
vpc_tag_name="csye6225-vpc-cli-1"
###########################
# Create STACH NAME 

echo "Enter STACK_NAME: "
read STACK_NAME
#stack_id = $(aws cloudformation create-stack --stack-name $STACK_NAME --template-body file://sampletemplate.json --parameters ParameterKey=KeyPairName,ParameterValue=TestKey ParameterKey=SubnetIDs,ParameterValue=SubnetID1\\,SubnetID2 --query '[StackId]' --output text)
echo "STACK_NAME entered: " $STACK_NAME

###################################
# Create VPC with CLI command:
echo " Creating  VPC..."
echo "Please enter vpc-cidr block : "
read vpc_cidr_block
vpc_id=$(aws ec2 create-vpc --cidr-block $vpc_cidr_block --query 'Vpc.[VpcId]' --output text --region $region 2>&1)
vpc_status=$?
if [ $vpc_status -eq 0 ]; then
	echo "Vpc id: "$vpc_id " is created in region : " $region
else
	echo "Error in creating VPC..."
	exit $vpc_status
fi

##############################
#Create Tag for generated VPC
echo "Creating Tag Name for VPC ..."
aws ec2 create-tags --resources $vpc_id --tags Key=Name,Value=$vpc_tag_name --region $region 2>&1
tag_status=$?
if [ $tag_status -eq 0 ]; then
	echo "VPC tag name created successfully with name : " $vpc_tag_name
else
	echo "Error in creating tag name..."
	exit $tag_status
fi

# Get availability zones
# avail_zones=$(aws ec2 describe-availability-zones)
# echo $avail_zones

###############################
# Create Public Subnets
echo "Enter Valid Public subnet-1 cidr-block : "
read pub_subnet1
echo "Enter Valid availability Public zone 1 : "
read pub_zone1
pub_subid1=$(aws ec2 create-subnet --availability-zone $pub_zone1 --vpc-id $vpc_id --cidr-block $pub_subnet1 --query 'Subnet.[SubnetId]' --output text)
echo "Generated Public subnet-id 1: " $pub_subid1
echo "Entered AvailabilityZone for Public subnet-1 : " $pub_zone1
echo "Enter public subnet-1 Tag Name : "
read sub_tag1
aws ec2 create-tags --resources $pub_subid1 --tags "Key=Name,Value=$sub_tag1" 2>&1


echo "Enter Valid Public subnet-2 cidr-block : "
read pub_subnet2
echo "Enter Valid availability Public zone 2 : "
read pub_zone2
pub_subid2=$(aws ec2 create-subnet --availability-zone $pub_zone1 --vpc-id $vpc_id --cidr-block $pub_subnet2 --query 'Subnet.[SubnetId]' --output text)
echo "Generated Public subnet-id 2: " $pub_subid2
echo "Entered AvailabilityZone for Public subnet-2 : " $pub_zone2
echo "Enter public subnet-2 Tag Name : "
read sub_tag2
aws ec2 create-tags --resources $pub_subid2 --tags "Key=Name,Value=$sub_tag2" 2>&1


echo "Enter Valid subnet-3 cidr-block : "
read pub_subnet3
echo "Enter Valid availability public zone 3 : "
read pub_zone3
pub_subid3=$(aws ec2 create-subnet --vpc-id $vpc_id --cidr-block $pub_subnet3 --query 'Subnet.[SubnetId]' --output text)
echo "Generated Public subnet-id 3: " $pub_subid3
echo "Entered AvailabilityZone for Public Subnet-3 : " $pub_zone3
echo "Enter public subnet-3 Tag Name : "
read sub_tag3
aws ec2 create-tags --resources $pub_subid3 --tags "Key=Name,Value=$sub_tag3" 2>&1


echo "Three Public subnets created successfully...."


###############################
# Create Private Subnets
echo "Enter Valid Private subnet-1 cidr-block : "
read pri_subnet1
echo "Enter Valid availability Private zone 1 : "
read pri_zone1
pri_subid1=$(aws ec2 create-subnet --availability-zone $pri_zone1 --vpc-id $vpc_id --cidr-block $pri_subnet1 --query 'Subnet.[SubnetId]' --output text)
echo "Generated Private subnet-id 1: " $pri_subid1
echo "Entered AvailabilityZone for Private subnet-1 : " $pri_zone1
echo "Enter Private subnet-1 Tag Name : "
read pri_tag1
aws ec2 create-tags --resources $pri_subid1 --tags "Key=Name,Value=$pri_tag1" 2>&1


echo "Enter Valid Private subnet-2 cidr-block : "
read pri_subnet2
echo "Enter Valid availability Private zone 2 : "
read pri_zone2
pri_subid2=$(aws ec2 create-subnet --availability-zone $pri_zone2 --vpc-id $vpc_id --cidr-block $pri_subnet2 --query 'Subnet.[SubnetId]' --output text)
echo "Generated Private subnet-id 2: " $pri_subid2
echo "Entered AvailabilityZone for Private subnet-2 : " $pri_zone2
echo "Enter Private subnet-2 Tag Name : "
read pri_tag2
aws ec2 create-tags --resources $pri_subid2 --tags "Key=Name,Value=$pri_tag2" 2>&1


echo "Enter Valid Private subnet-3 cidr-block : "
read pri_subnet3
echo "Enter Valid availability private zone 3 : "
read pri_zone3
pri_subid3=$(aws ec2 create-subnet --availability-zone $pri_zone3 --vpc-id $vpc_id --cidr-block $pri_subnet3 --query 'Subnet.[SubnetId]' --output text)
echo "Generated Private subnet-id 3: " $pri_subid3
echo "Entered AvailabilityZone for Private Subnet-3 : " $pri_zone3
echo "Enter Private subnet-3 Tag Name : "
read pri_tag3
aws ec2 create-tags --resources $pri_subid3 --tags "Key=Name,Value=$pri_tag3" 2>&1

echo "Three Private subnets created successfully...."

##########################
#Create Internet Gateway
echo "Creating internt gateway"
new_ig_id=$(aws ec2 create-internet-gateway --query 'InternetGateway.[InternetGatewayId]' --output text --region $region 2>&1)
igw_status=$?
if [ $igw_status -eq 0 ]; then
	echo "Successfully created Internet Gateway : -" $new_ig_id
else
	echo "Error in creating Internet Gateway...."
	exit $igw_status
fi

###############################
#Create Tag for Intenet Gateway
echo "Adding Name to Internet Gateway..."
echo "Please enter valid Internet Gateway Name : "
read igw_tag_name
aws ec2 create-tags --resources $new_ig_id --tags "Key=Name,Value=$igw_tag_name" 2>&1
igw_tag_status=$?
if [ $igw_tag_status -eq 0 ]; then
	echo "Internet Gateway Tag created successfully with name : "$igw_tag_name
else
	echo "Error in creating tag for Internet Gateway..."
	exit $igw_tag_status
fi

##############################
#Attach Internet Gateway
echo "Attaching internet gateway to VPC"
attach_ig=$(aws ec2 attach-internet-gateway --internet-gateway-id $new_ig_id --vpc-id $vpc_id --region $region 2>&1) 
att_ig_status=$?
if [ $att_ig_status -eq 0 ]; then
	echo "VPC is successfully attached with Internet Gateway : " $attach_ig
else
	echo "Error in attaching Internet Gateway...."
	exit $att_ig_status
fi

#########################################
# Creating NAT Gateway
#echo "Creating NAT Gateway...."
#alloc_id=$(aws ec2 allocate-address --domain vpc --query '[AllocationId]' --output text)
#echo "AllocationId generated : " $alloc_id
#
#nat_id=$(aws ec2 create-nat-gateway --subnet-id $pub_subid1 --allocation-id $alloc_id --query 'NatGateway.{NatGatewayId}' --output text)
#echo "Generated NatGatewayId : " $nat_id
#echo "Please enter valid NAT Gateway Name : "
#read nat_tag_name
#aws ec2 create-tags --resources $nat_id --tags "Key=Name,Value=$nat_tag_name" 2>&1


##################################
# Create Public Route Table
echo "Creating Public Route Table..."
pub_rt_id=$(aws ec2 create-route-table --vpc-id $vpc_id --query 'RouteTable.[RouteTableId]' --output text --region $region 2>&1)
pub_rt_status=$?
if [ $pub_rt_status -eq 0 ]; then
	echo "New Public Route Table Created Successfully : " $pub_rt_id
else
	echo "Error in creating Public Route Table..."
	exit $pub_rt_status
fi


###################################
# Add Name to Route Table
echo "Adding Name to Route Table..."
echo "Please enter valid Route Table Name : "
read rt_tag_name
aws ec2 create-tags --resources $pub_rt_id --tags "Key=Name,Value=$rt_tag_name" 2>&1
rt_tag_status=$?
if [ $rt_tag_status -eq 0 ]; then
        echo "Route Table Tag created successfully with name : "$rt_tag_name
else
        echo "Error in creating tag for Route Table..."
        exit $rt_tag_status
fi

#####################################
# Create Route to Internet Gateway...
ing_route=$(aws ec2 create-route --route-table-id $pub_rt_id --destination-cidr-block 0.0.0.0/0 --gateway-id $new_ig_id --region $region 2>&1)
rig_status=$?
if [ $rig_status -eq 0 ]; then
	echo "New Route to 0.0.0.0/0 Created through Internet GatewayID : " $new_ig_id " and Route TableId : " $pub_rt_id
else
	echo "Error in creating Route to Internet Gateway...."
	exit $rig_status
fi



#####################################
# Create Route to NAT Gateway...
#nat_route=$(aws ec2 create-route --route-table-id $pub_rt_id --destination-cidr-block 0.0.0.0/0 --gateway-id $nat_id --region $region 2>&1)
#rng_status=$?
#if [ $rng_status -eq 0 ]; then
#        echo "New Route to 0.0.0.0/0 Created through NATGatewayID : " $nat_id " and Route TableId : " $pri_rt_id
#else
#        echo "Error in creating Route to NATGateway...."
#        exit $rng_status
#fi

########################################
# Attach route to subnets
aws ec2 associate-route-table --route-table-id $pub_rt_id --subnet-id $pub_subid1
aws ec2 associate-route-table --route-table-id $pub_rt_id --subnet-id $pub_subid2
aws ec2 associate-route-table --route-table-id $pub_rt_id --subnet-id $pub_subid3
rt_sub_status=$?
if [ $rt_sub_status -eq 0 ]; then
        echo "Route associated to subnet successfully...."
else
        echo "Error in associating Routes to subnets...."
        exit $rt_sub_status
fi

echo "Script run successfully....."
