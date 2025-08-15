# AI Readiness App Deployment Guide

## Prerequisites

- GitHub repository with your code
- Render account
- OpenAI API key
- SendGrid API key and verified sender email

## Environment Variables

Set these in your Render web service:

### Required Variables
```
NODE_ENV = production
DATABASE_URL = [Auto-provided by Render from PostgreSQL database]
OPENAI_API_KEY = [Your OpenAI API key]
SENDGRID_API_KEY = [Your SendGrid API key]
SENDGRID_FROM_EMAIL = [Your verified sender email in SendGrid]
SENDGRID_FROM_NAME = AI Readiness Reports
SITE_URL = [Your Render app URL after deployment]
```

### Optional Variables
```
OPENAI_MODEL = gpt-4o-mini
```

## Database Setup

1. Create PostgreSQL database in Render
2. Name: `ai-readiness-db`
3. Database: `ai_readiness_db`
4. User: `ai_readiness_user`
5. Plan: Starter (free)

## Deployment Steps

1. **Push to GitHub**: All changes are committed and pushed
2. **Render Build**: Render automatically builds and deploys
3. **Database Migration**: Prisma automatically creates tables
4. **Test**: Visit your app and test the assessment form
5. **Admin Access**: Visit `/admin` to download CSV exports

## CSV Export for HubSpot

The admin panel at `/admin` provides:
- Download all submissions as CSV
- Includes: date, email, company, score, tier, email status, pain points, AI report
- Perfect for HubSpot contact import

## Troubleshooting

### Common Issues
- **Build Failures**: Check that all dependencies are in package.json
- **Database Errors**: Verify DATABASE_URL is set correctly
- **Email Failures**: Check SendGrid API key and verified sender
- **Prisma Errors**: Ensure npx prisma generate runs during build

### Logs
Check Render logs for detailed error information.

## Local Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run locally
npm run dev
```

## Database Schema

The app automatically creates these tables:
- `User`: Stores user email addresses
- `Submission`: Stores assessment data, scores, and AI reports

All data is automatically backed up by Render PostgreSQL.
