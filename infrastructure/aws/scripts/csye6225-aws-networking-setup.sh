# Create VPC with CLI command

echo "Creating VPC..."
# aws ec2 create-vpc --cidr-block 10.0.0.0/16

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
aws ec2 create-subnet --vpc-id vpc-0be70c10aa459c235 --cidr-block 10.0.2.0/24

