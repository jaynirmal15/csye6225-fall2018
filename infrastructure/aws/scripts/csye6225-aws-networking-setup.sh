# Create STACH NAME 

echo "Enter STACK_NAME: "
read STACK_NAME
echo "STACK_NAME entered: " $STACK_NAME

# Create VPC with CLI command:

echo "Enter Valid CIDR_BLOCK to Creat VPC..."
read CIDR_BLOCK
vpc_id=$(aws ec2 create-vpc --cidr-block $CIDR_BLOCK --query 'Vpc.[VpcId]' --output text)
echo "Entered CIDR-BLOCK: " $CIDR_BLOCK
echo "Vpc id generated : "$vpc_id

#vpc_id=$(aws ec2 describe-vpcs --query 'Vpcs[0].[VpcId]' --output text)
#echo $vpc_id

#Create Tag for generated VPC
echo "Enter Tag Name..."
read tag_name
aws ec2 create-tags --resources $vpc_id --tags Key=Name,Value=$tag_name


# Get availability zones
# avail_zones=$(aws ec2 describe-availability-zones)
# echo $avail_zones

# Create Subnets
echo "Enter Valid subnet-1 cidr-block to create subnet 1...."
read subnet1
echo "Enter Valid availability zone 1 : "
read zone1
sub_id1=$(aws ec2 create-subnet --availability-zone $zone1 --vpc-id $vpc_id --cidr-block $subnet1 --query 'Subnet.[SubnetId]' --output text)
echo "Generated subnet-id 1: " $sub_id1
echo "Entered AvailabilityZone : " $zone1
# Create Route Table
echo "Creating Route Table..."
new_rt_id=$(aws ec2 create-route-table --vpc-id $new_vpc --query 'RouteTable.[RouteTableId]' --output text)
echo "New route table created: " $new_rt_id

# Create Route
#new_route=$(aws ec2 create-route --route-table-id $new_rt_id --destination-cidr-block 0.0.0.0/0 --gateway-id $new_ig_id)



echo "Enter Valid subnet-2 cidr-block to create subnet 2...."
read subnet2
echo "Enter Valid availability zone 2 : "
read zone2
sub_id2=$(aws ec2 create-subnet --availability-zone $zone1 --vpc-id $vpc_id --cidr-block $subnet2 --query 'Subnet.[SubnetId]' --output text)
echo "Generated subnet-id 2: " $sub_id2
echo "Entered AvailabilityZone : " $zone2

echo "Enter Valid subnet-3 cidr-block to create subnet 3...."
read subnet3
echo "Enter Valid availability zone 3 : "
read zone3
sub_id3=$(aws ec2 create-subnet --vpc-id $vpc_id --cidr-block $subnet3 --query 'Subnet.[SubnetId]' --output text)
echo "Generated subnet-id 3: " $sub_id3
echo "Entered AvailabilityZone : " $zone3


echo "Three subnets created successfully...."
