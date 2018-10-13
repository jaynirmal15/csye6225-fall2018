echo "Please Enter a Name for the stack: "
read stack_name

#VPC Name
jq '.Resources.myVPC.Properties.Tags[0].Value = "'$stack_name'-csye6225-vpc"' ../cloudformation/csye6225-cf-networking.json > tmp.$$.json && mv tmp.$$.json ../cloudformation/csye6225-cf-networking.json
#Subnets
jq '.Resources.publicsubnet1.Properties.Tags[0].Value = "'$stack_name'-public-subnet-1"' ../cloudformation/csye6225-cf-networking.json > tmp.$$.json && mv tmp.$$.json ../cloudformation/csye6225-cf-networking.json

jq '.Resources.privatesubnet1.Properties.Tags[0].Value = "'$stack_name'-private-subnet-1"' ../cloudformation/csye6225-cf-networking.json > tmp.$$.json && mv tmp.$$.json ../cloudformation/csye6225-cf-networking.json

jq '.Resources.publicsubnet2.Properties.Tags[0].Value = "'$stack_name'-public-subnet-2"' ../cloudformation/csye6225-cf-networking.json > tmp.$$.json && mv tmp.$$.json ../cloudformation/csye6225-cf-networking.json

jq '.Resources.privatesubnet2.Properties.Tags[0].Value = "'$stack_name'-private-subnet-2"' ../cloudformation/csye6225-cf-networking.json > tmp.$$.json && mv tmp.$$.json ../cloudformation/csye6225-cf-networking.json

jq '.Resources.publicsubnet3.Properties.Tags[0].Value = "'$stack_name'-public-subnet-3"' ../cloudformation/csye6225-cf-networking.json > tmp.$$.json && mv tmp.$$.json ../cloudformation/csye6225-cf-networking.json

jq '.Resources.privatesubnet3.Properties.Tags[0].Value = "'$stack_name'-private-subnet-3"' ../cloudformation/csye6225-cf-networking.json > tmp.$$.json && mv tmp.$$.json ../cloudformation/csye6225-cf-networking.json
#Internet Gateway
jq '.Resources.myInternetGateway.Properties.Tags[0].Value = "'$stack_name'-csye6225-InternetGateway"' ../cloudformation/csye6225-cf-networking.json > tmp.$$.json && mv tmp.$$.json ../cloudformation/csye6225-cf-networking.json
#Route Table
jq '.Resources.publicRouteTable.Properties.Tags[0].Value = "'$stack_name'-csye6225-public-route-table"' ../cloudformation/csye6225-cf-networking.json > tmp.$$.json && mv tmp.$$.json ../cloudformation/csye6225-cf-networking.json

jq '.Resources.privateRouteTable.Properties.Tags[0].Value = "'$stack_name'-csye6225-private-route-table"' ../cloudformation/csye6225-cf-networking.json > tmp.$$.json && mv tmp.$$.json ../cloudformation/csye6225-cf-networking.json

echo "Executing Create Stack....."

aws cloudformation create-stack --stack-name ${stack_name} --template-body file://../cloudformation/csye6225-cf-networking.json --capabilities=CAPABILITY_NAMED_IAM

if [ $? -eq 0 ]; then
	echo "Waiting to create gets executed completely...!"
else
	echo "Error in Create Stack...Exiting..."
	exit 1
fi

aws cloudformation wait stack-create-complete --stack-name ${stack_name}

if [ $? -eq 0 ]; then
	echo "Create successfully executed...!"
else
	echo "Error in Create Stack...Exiting..."
	exit 1
fi

echo "Stack Create Execution Complete...!!!"
