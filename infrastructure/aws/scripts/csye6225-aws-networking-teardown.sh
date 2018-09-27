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
	echo " Deleting Vpc that you entered the name....."
elif [ $input == "2" ]; then
	echo " Please select the subnetId to be deleted..."
	aws ec2 describe-subnets --filters Name=vpc-id,Values=${vpc_id} | jq -r '.Subnets[].SubnetId'
elif [ $input == "3" ]; then
	echo
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

