###################################################################################
#starting of script
#Get a STACK name to create new one.
###################################################################################
echo "Please Enter a new name for the stack: "
read stack_name

fnName="lambdaFunction"
lambdaArn=$(aws lambda get-function --function-name $fnName --query Configuration.FunctionArn --output text)
echo "lambdaArn: $lambdaArn"


createOutput=$(aws cloudformation create-stack --stack-name $stack_name --template-body file://../cloudformation/csye6225-cf-serverless.json --parameters ParameterKey=lambdaArn,ParameterValue=$lambdaArn)

if [ $? -eq 0 ]; then
	echo "Creating stack..."
	aws cloudformation wait stack-create-complete --stack-name $stack_name
	echo "Stack created successfully. Stack Id below: "
	echo $createOutput

else
	echo "Error in creation of stack"
	echo $createOutput
fi;

