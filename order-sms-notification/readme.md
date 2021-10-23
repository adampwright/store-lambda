Zip function ready to upload:

```
zip -r lambdaFunc.zip *.

```

To upload with AWS CLI:

```
aws lambda update-function-code --function-name order-sms-notification --zip-file fileb://order-sms-notification.zip
```
