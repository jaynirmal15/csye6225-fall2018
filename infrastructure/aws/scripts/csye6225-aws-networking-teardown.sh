#!/usr/bin/bash

echo " Please enter valid VPC name to delete...."
read vpcName

vpcId=$(aws ec2 describe-vpcs --query "Vpcs[?Tags[?Key=='Name']|[?Value=='$vpcName']].VpcId" --output text)
echo "vpcId : " $vpcId

echo " Please enter the valid option from below :"
echo " Vpc Delete - Press 1"
echo " Subnet Delete - Press 2"
echo " Internet Gateway Delete - Press 3"
echo " Route Table Delete - Press 4"
read input

if [ $input == "1" ]; then
	echo " Deleting Vpc with entered the name : " $vpcName
	aws ec2 delete-vpc --vpc-id $vpcId
	dl_vpc=$?
	if [ $dl_vpc -eq 0 ]; then
		echo "VPC deleted Successfully...."
	else
		echo "Error in deleting vpc..."
		exit 1
	fi
elif [ $input == "2" ]; then
#	aws ec2 describe-subnets --filters Name=vpc-id,Values=${vpc_id} | jq -r '.Subnets[].SubnetId'
	aws ec2 describe-subnets --filters Name=vpc-id,Values=$vpcId | jq -r '.Subnets[].Tags[] | select(.Key == "Name").Value'
	echo "Enter the subnet name to delete it..."
	read sub_name
	del_subId=$(aws ec2 describe-subnets --query "Subnets[?Tags[?Value=='$sub_name']].SubnetId" --output text)
	echo "Deleting subnet : " $sub_name        
	aws ec2 delete-subnet --subnet-id $del_subId
        dl_sub=$?
	if [ $dl_sub -eq 0 ]; then
		echo "Subnet Deleted Successfully..."
	else
		echo "Error in deleting subnet.."
		exit 1
	fi
elif [ $input == "3" ]; then
	echo " Please enter the name of the Internet Gateway....."
	read igw_name
	echo "Started deleting Internet Gateway...."
	IGW_Id=$(aws ec2 describe-internet-gateways --query "InternetGateways[?Attachments[?VpcId=='$vpcId']].InternetGatewayId" --output text)
	echo $IGW_Id
	aws ec2 detach-internet-gateway --internet-gateway-id $IGW_Id --vpc-id $vpcId
	dl_igw=$?
	if [ $dl_igw -eq 0 ]; then
		echo "Internet Gateway Detached successfully...."
	else
		echo "Error in deleting Internet Gateway...."
		exit 1
	fi
elif [ $input == "4" ]; then
	echo "fetching Route table"
	aws ec2 describe-route-tables --filters Name=vpc-id,Values=$vpcId | jq -r '.RouteTables[] | select(.Tags[].Key == "Name").Tags[].Value,.RouteTableId'
	echo "Enter route table ID to delete: "
	read rtId
	aws ec2 delete-route-table --route-table-id $rtId
	if [ $? -eq 0 ]; then
		echo "Route table deleted successfully...!"
	else
		echo "Error in deletion..."
		exit 1
	fi

else
	echo "Invalid input detected....."
	exit 1
fi

