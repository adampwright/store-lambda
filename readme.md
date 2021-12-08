Command to zip project file and upload to lambda

Linux

```
zip -r ./<filename>.zip . && aws lambda update-function-code --function-name <Lambda function name> --zip-file fileb://<filename>.zip

```
