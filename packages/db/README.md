### Connecting to deployed database locally

```bash
aws ssm start-session \
  --target "<EC2_ID>" \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters '{"host":["<DB_HOST>"],"portNumber":["5432"],"localPortNumber":["15432"]}'
```

```bash
sst get PROD_DB_PASSWORD --stage production
```
