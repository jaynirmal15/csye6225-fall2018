echo "Please Enter a Name for the stack: "
read stack_name

#VPC Name
#refVPC=$(cat ../cloudformation/csye6225-cf-networking.json | jq '.Resources.myVPC')

#echo $refVPC

#jq '.Resources.Ec2Instance.Properties.VpcId.Ref = "'$refVPC'"' ../cloudformation/csye6225-cf-application.json > tmp.$$.json && mv tmp.$$.json ../cloudformation/csye6225-cf-application.json

echo "Executing Create Stack....."

aws cloudformation create-stack --stack-name ${stack_name} --template-body file://../cloudformation/csye6225-cf-application.json --capabilities=CAPABILITY_NAMED_IAM

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
