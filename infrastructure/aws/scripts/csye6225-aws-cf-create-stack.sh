echo "Please Enter a Name for the stack: "
read stack_name

jq '.Resources.myVPC.Properties.Tags[0].Value = "'$stack_name'-csye6225-vpc"' ../cloudformation/csye6225-cf-networking.json > tmp.$$.json && mv tmp.$$.json ../cloudformation/csye6225-cf-networking.json

jq '.Resources.subnet1.Properties.Tags[0].Value = "'$stack_name'-csye6225-subnet1"' ../cloudformation/csye6225-cf-networking.json > tmp.$$.json && mv tmp.$$.json ../cloudformation/csye6225-cf-networking.json

jq '.Resources.subnet2.Properties.Tags[0].Value = "'$stack_name'-csye6225-subnet2"' ../cloudformation/csye6225-cf-networking.json > tmp.$$.json && mv tmp.$$.json ../cloudformation/csye6225-cf-networking.json

jq '.Resources.subnet3.Properties.Tags[0].Value = "'$stack_name'-csye6225-subnet3"' ../cloudformation/csye6225-cf-networking.json > tmp.$$.json && mv tmp.$$.json ../cloudformation/csye6225-cf-networking.json


jq '.Resources.myInternetGateway.Properties.Tags[0].Value = "'$stack_name'-csye6225-InternetGateway"' ../cloudformation/csye6225-cf-networking.json > tmp.$$.json && mv tmp.$$.json ../cloudformation/csye6225-cf-networking.json

echo "Executing Create Stack....."

aws cloudformation create-stack --stack-name ${stack_name} --template-body file://../cloudformation/csye6225-cf-networking.json --capabilities=CAPABILITY_NAMED_IAM


aws cloudformation wait stack-create-complete --stack-name ${stack_name}

echo "Stack Create Execution Complete...!!!"
