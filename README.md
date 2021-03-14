# Lambda EC2 rebooter

Reboot EC2 instance on UptimeRobot down alert webhook

Install `serverless` globally

```bash
npm install -g serverless
```

Setup AWS credentials

```bash
serverless config credentials --provider aws --key <key> --secret <secret>
```

Local development emulating AWS API Gateway with file watch change

```bash
npm install
sls offline start
```

Deploy AWS Lambda

```bash
serverless deploy --stage production --region sa-east-1
```

