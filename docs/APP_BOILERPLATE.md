# Multi-Webapp Deployment Guide

Deploy static apps to `chamfered-webapps` S3 with CloudFront + Route53.

Tech stack: react, typescript, vite, tailwind-css, vitest, storybook, eslint, node engine in package.json. Use latest dep versions available on npm. Actions use pinned commit SHAs for security.

**Variables**: `{REPO_NAME}`(for trust policy), `{APP_NAME}`(for s3 prefix), `{SUBDOMAIN}`

## Architecture: Shared S3 Bucket, Separate Distributions

Multiple unrelated apps **share one S3 bucket** with **separate CloudFront distributions** (one per app):

```
chamfered-webapps (S3 bucket)
├── app1/              → Distribution E2221UPIQ451E5 → app1.chamfered.dev
├── app2/              → Distribution D1234ABCD5678E → app2.chamfered.dev
└── app3/              → Distribution F9876XYZK2345L → app3.chamfered.dev
```

**Why separate distributions?**
- Each app gets independent cache invalidation (deploy without affecting others)
- Different cache policies per app (HTML: no-cache | Assets: 1hr)
- Separate monitoring, logs, and error pages per domain
- Isolated GitHub Actions workflows per repository
- Better security: each app's IAM role only accesses its S3 prefix

**Single distribution per app** (not shared) keeps blast radius minimal and allows per-app customization (headers, geo-restrictions, WAF rules, etc.).

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
  contents: read
  id-token: write

concurrency:
  group: 'deploy'
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - name: Checkout Repository
        uses: actions/checkout@f548e57e544e1ff5a4c46bf1e1b8685f8e4a348a

      - name: Setup Node.js 26
        uses: actions/setup-node@680d1e489b82f1243de15bc7665c0007e3c9a860
        with:
          node-version: '26'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Code Quality Checks
        run: npm run lint

      - name: Typecheck
        run: npm run typecheck

      - name: Run Unit & Component Tests
        run: npm run test:ci

      - name: Build Web Application
        run: npm run build

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@3557a071ad648a12260a481c2e613d138d99c690
        with:
          role-to-assume: arn:aws:iam::811555881555:role/github-actions-deploy-{APP_NAME}
          aws-region: us-west-2

      - name: Deploy to S3
        run: aws s3 sync ./dist s3://chamfered-webapps/{APP_NAME} --delete

      - name: Invalidate CloudFront Distribution
        run: aws cloudfront create-invalidation --distribution-id {CLOUDFRONT_DIST_ID} --paths "/*"
```

**Notes:**
- Actions use pinned commit SHAs (e.g., `actions/checkout@f548e57e544e1ff5a4c46bf1e1b8685f8e4a348a`) instead of `v4` for security and reproducibility
- Single unified job combining build and deploy (no artifact passing)
- Include lint, typecheck, and test steps before building
- Uses `concurrency` to cancel previous deployments when pushing new commits
- S3 sync with `--delete` removes files not in local `dist/`

## Caching

CloudFront caching is configured via the distribution's **DefaultCacheBehavior**:
- **HTML**: `DefaultTTL: 0` (no-cache, always revalidate)
- **Assets** (JS/CSS): `DefaultTTL: 86400` (1 hour)

For fine-grained per-file-type caching, modify the S3 sync command:

```bash
# Cache static assets (1 hour)
aws s3 sync ./dist s3://chamfered-webapps/{APP_NAME}/ --delete \
  --cache-control 'public, max-age=3600' \
  --exclude '*.html' --exclude '*.json'

# Don't cache HTML (always revalidate)
aws s3 sync ./dist s3://chamfered-webapps/{APP_NAME}/ \
  --cache-control 'public, max-age=0, must-revalidate' \
  --include '*.html'
```

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

## Adding More Apps (Reusing Bucket)

Once `chamfered-webapps` bucket is created, adding a second app is simpler:

1. **Create new IAM role** for the app's repo (Step 1, same policy structure but new role name)
2. **Create new CloudFront distribution** pointing to same bucket with new S3 prefix (Step 2, e.g., `app2/`)
3. **Request new ACM cert** for new subdomain in us-east-1 (Step 3)
4. **Attach cert to new distribution** (Step 4, separate distribution)
5. **Add GitHub Actions** to new repo's workflow (Step 5)

Each app's IAM policy restricts access to its own S3 prefix: `s3:::chamfered-webapps/{APP_NAME}/*`

**Note:** The S3 bucket **policy only needs to be set once** when first creating OAI. Subsequent apps just need their own CloudFront distribution, certificate, and IAM role—they automatically use the same bucket policy via different OAI identities.
