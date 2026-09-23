# Multi-Webapp Deployment Guide

Deploy static apps to `chamfered-webapps` S3 with CloudFront + Route53.

Tech stack: react, typescript, vite, tailwind-css, vitest, storybook, eslint, node engine in package.json. Use latest dep versions available on npm.

**Variables**: `{REPO_NAME}`(for trust policy), `{APP_NAME}`(for s3 prefix), `{SUBDOMAIN}`

## Step 1: IAM Role

```bash
REPO_NAME="{REPO_NAME}"
APP_NAME="{APP_NAME}"
aws iam create-role --role-name "github-actions-deploy-${APP_NAME}" --assume-role-policy-document '{
  "Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Federated":"arn:aws:iam::811555881555:oidc-provider/token.actions.githubusercontent.com"},"Action":"sts:AssumeRoleWithWebIdentity","Condition":{"StringEquals":{"token.actions.githubusercontent.com:sub":"repo:jaeseopark/'"${REPO_NAME}"':ref:refs/heads/master"}}}]}'

aws iam put-role-policy --role-name "github-actions-deploy-${APP_NAME}" --policy-name s3-deploy --policy-document '{
  "Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:PutObject","s3:GetObject","s3:ListBucket","s3:DeleteObject"],"Resource":["arn:aws:s3:::chamfered-webapps","arn:aws:s3:::chamfered-webapps/'"${APP_NAME}"'/*"]},{"Effect":"Allow","Action":"cloudfront:CreateInvalidation","Resource":"*"}]}'
```

## Step 2: CloudFront Distribution

```bash
APP_NAME="{APP_NAME}"
OAI=$(aws cloudfront create-cloud-front-origin-access-identity --cloud-front-origin-access-identity-config "{CallerReference:\"${APP_NAME}-$(date +%s)\",Comment:\"OAI for ${APP_NAME}\"}" --query 'CloudFrontOriginAccessIdentity.Id' --output text)
CANONICAL=$(aws cloudfront get-cloud-front-origin-access-identity --id "$OAI" --query 'CloudFrontOriginAccessIdentity.S3CanonicalUserId' --output text)

aws s3api put-bucket-policy --bucket chamfered-webapps --policy '{
  "Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"CanonicalUser":"'"${CANONICAL}"'"},"Action":["s3:GetObject","s3:ListBucket"],"Resource":["arn:aws:s3:::chamfered-webapps","arn:aws:s3:::chamfered-webapps/'"${APP_NAME}"'/*"]}]}'

DIST=$(aws cloudfront create-distribution --distribution-config '{
  "CallerReference":"'"${APP_NAME}-$(date +%s)"'","Comment":"'"${APP_NAME}"'","Enabled":true,"Origins":{"Quantity":1,"Items":[{"Id":"S3","DomainName":"chamfered-webapps.s3.us-west-2.amazonaws.com","OriginPath":"/'"${APP_NAME}"'","S3OriginConfig":{"OriginAccessIdentity":"origin-access-identity/cloudfront/'"${OAI}"'"}}]},"DefaultRootObject":"index.html","DefaultCacheBehavior":{"TargetOriginId":"S3","ViewerProtocolPolicy":"redirect-to-https","AllowedMethods":{"Quantity":2,"Items":["GET","HEAD"]},"ForwardedValues":{"QueryString":false,"Cookies":{"Forward":"none"}},"TrustedSigners":{"Enabled":false,"Quantity":0},"MinTTL":0,"DefaultTTL":86400,"MaxTTL":31536000,"Compress":true}}' --output json)

echo "DIST_ID=$(echo $DIST | jq -r '.Distribution.Id')"
echo "DIST_DOMAIN=$(echo $DIST | jq -r '.Distribution.DomainName')"
```

## Step 3: ACM Certificate

```bash
SUBDOMAIN="{SUBDOMAIN}"
DOMAIN="${SUBDOMAIN}.chamfered.dev"
CERT=$(aws acm request-certificate --domain-name "$DOMAIN" --validation-method DNS --region us-east-1 --output json)
CERT_ARN=$(echo $CERT | jq -r '.CertificateArn')

sleep 5
VALIDATION=$(aws acm describe-certificate --certificate-arn "$CERT_ARN" --region us-east-1 --query 'Certificate.DomainValidationOptions[0].ResourceRecord' --output json)
RECORD_NAME=$(echo $VALIDATION | jq -r '.Name')
RECORD_VALUE=$(echo $VALIDATION | jq -r '.Value')
RECORD_TYPE=$(echo $VALIDATION | jq -r '.Type')
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='chamfered.dev.'].Id" --output text | cut -d'/' -f3)

aws route53 change-resource-record-sets --hosted-zone-id "$HOSTED_ZONE_ID" --change-batch '{
  "Changes":[{"Action":"CREATE","ResourceRecordSet":{"Name":"'"${RECORD_NAME}"'","Type":"'"${RECORD_TYPE}"'","TTL":60,"ResourceRecords":[{"Value":"'"${RECORD_VALUE}"'"}]}}]}'

echo "Waiting for cert validation..."
sleep 10
aws acm describe-certificate --certificate-arn "$CERT_ARN" --region us-east-1 --query 'Certificate.Status'
```

## Step 4: Attach Certificate & Create DNS

Wait for cert status `ISSUED`, then:

```bash
DIST_ID="{CLOUDFRONT_DIST_ID}"
CERT_ARN="{CERT_ARN}"
SUBDOMAIN="{SUBDOMAIN}"
DOMAIN="${SUBDOMAIN}.chamfered.dev"
DIST_DOMAIN="{CLOUDFRONT_DOMAIN}"

aws cloudfront get-distribution-config --id "$DIST_ID" --output json > /tmp/cf.json
jq '.DistributionConfig.ViewerCertificate={ACMCertificateArn:"'"${CERT_ARN}"'",SSLSupportMethod:"sni-only",MinimumProtocolVersion:"TLSv1.2_2021"} | .DistributionConfig.Aliases={Quantity:1,Items:["'"${DOMAIN}"'"]}' /tmp/cf.json > /tmp/cf-upd.json
ETAG=$(jq -r '.ETag' /tmp/cf.json)
aws cloudfront update-distribution --id "$DIST_ID" --distribution-config file:///tmp/cf-upd.json --if-match "$ETAG"

HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='chamfered.dev.'].Id" --output text | cut -d'/' -f3)
aws route53 change-resource-record-sets --hosted-zone-id "$HOSTED_ZONE_ID" --change-batch '{
  "Changes":[{"Action":"CREATE","ResourceRecordSet":{"Name":"'"${DOMAIN}"'","Type":"A","AliasTarget":{"HostedZoneId":"Z2FDTNDATAQYW2","DNSName":"'"${DIST_DOMAIN}"'","EvaluateTargetHealth":false}}}]}'
```

## Step 5: GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [master]
permissions:
  id-token: write
env:
  AWS_ACCOUNT_ID: '811555881555'
  S3_BUCKET: chamfered-webapps
  S3_PREFIX: {APP_NAME}
  CF_DIST_ID: {CLOUDFRONT_DIST_ID}
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18' }
      - uses: pnpm/action-setup@v2
        with: { version: '8' }
      - run: pnpm install --frozen-lockfile && pnpm build
      - uses: actions/upload-artifact@v3
        with: { name: build, path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
        with: { name: build, path: ./dist }
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ env.AWS_ACCOUNT_ID }}:role/github-actions-deploy-{APP_NAME}
          aws-region: us-west-2
      - run: |
          aws s3 sync ./dist s3://${{ env.S3_BUCKET }}/${{ env.S3_PREFIX }}/ --delete --cache-control 'public, max-age=3600' --exclude '*.html'
          aws s3 sync ./dist s3://${{ env.S3_BUCKET }}/${{ env.S3_PREFIX }}/ --cache-control 'public, max-age=0, must-revalidate' --include '*.html'
          aws cloudfront create-invalidation --distribution-id ${{ env.CF_DIST_ID }} --paths '/*'
```

## Example: Grey

- Prefix: `grey/` | Domain: `grey.chamfered.dev` | IAM: `github-actions-deploy-grey`
- CloudFront: `E2221UPIQ451E5` | URL: `https://grey.chamfered.dev`

## Caching

**HTML**: no-cache | **Assets**: 1 hour

## Quick Checks

```bash
aws acm describe-certificate --certificate-arn {CERT_ARN} --region us-east-1 --query 'Certificate.Status'
aws cloudfront get-distribution --id {DIST_ID} --query 'Distribution.Status'
aws s3 ls s3://chamfered-webapps/{APP_NAME}/ --recursive
aws cloudfront create-invalidation --distribution-id {DIST_ID} --paths '/*'
nslookup {SUBDOMAIN}.chamfered.dev
```

## Setup Steps

1. Create IAM role for GitHub OIDC
2. Create CloudFront distribution + OAI
3. Request ACM certificate (us-east-1) + validate via Route53
4. Attach cert to CloudFront + create Route53 ALIAS
5. Add GitHub Actions workflow
