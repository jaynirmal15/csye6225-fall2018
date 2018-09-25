# Create VPC with CLI command

echo "Creating VPC..."
new_vpc=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query 'Vpc.[VpcId]' --output text)
echo $new_vpc

echo "Enter STACK_NAME: "
read STACK_NAME
echo "STACK_NAME entered: " $STACK_NAME

# Get VPC id
#vpc_id=$(aws ec2 describe-vpcs --query 'Vpcs[0].[VpcId]' --output text)
#echo $vpc_id

# Get availability zones
# avail_zones=$(aws ec2 describe-availability-zones)
# echo $avail_zones

# Create Subnet
# aws ec2 create-subnet --vpc-id $vpc_id --cidr-block 10.0.1.0/24
#aws ec2 create-subnet --vpc-id vpc-0be70c10aa459c235 --cidr-block 10.0.2.0/24

# Create Subnet 3
#aws ec2 create-subnet --vpc-id $new_vpc --cidr-block 10.0.3.0/24


# Create Route Table
echo "Creating Route Table..."
new_rt_id=$(aws ec2 create-route-table --vpc-id $new_vpc --query 'RouteTable.[RouteTableId]' --output text)
echo "New route table created: " $new_rt_id

# Create Route
#new_route=$(aws ec2 create-route --route-table-id $new_rt_id --destination-cidr-block 0.0.0.0/0 --gateway-id $new_ig_id)






