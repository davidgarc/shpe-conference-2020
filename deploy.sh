#!/bin/bash
die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "1 argument required, $# provided"
echo $1 | grep -E -q '^dev|test|prod$' || die "Valid environment argument required (Ex: dev, test, prod), $1 provided"

find . -name template.yaml | while read -r fname; do
  templateName="${fname}"
  packagedName="packaged.yaml"
  outputFileName="${templateName/template.yaml/$packagedName}"
  echo "Packaging template ${templateName} into ${outputFileName}:"
  sam package --template-file "$templateName" --output-template-file "$outputFileName" --s3-bucket "resume-demo-configs-$1"
done

echo ""
echo "Coping to s3 templates"
aws s3 cp --recursive --exclude "*template.yaml" backend/templates "s3://resume-demo-configs-$1/templates/"

echo ""
echo "Deploying application"
sam deploy --template-file backend/packaged.yaml --stack-name "resume-demo-app-$1" --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND --parameter-overrides "Environment=$1"

echo ""
echo "Coping to website assets"
aws s3 cp --recursive public "s3://shpe-resume/"

echo "Done deploying $1 application"
