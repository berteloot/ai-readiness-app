# Environment Variables

This application requires the following environment variables to be set for secure operation:

## Required Variables

### Database Configuration
- `DATABASE_URL`: PostgreSQL connection string
  - Example: `postgresql://username:password@localhost:5432/database_name`

### Admin Authentication
- `ADMIN_PASSWORD`: Password for admin access
  - Should be a strong, unique password
  - Example: `MySecureAdminPassword123!`

- `ADMIN_SESSION_SECRET`: JWT signing secret
  - Should be a long, random string
  - Example: `your-super-secret-jwt-key-here-change-in-production`
  - **IMPORTANT**: Change this in production!

## Security Features

The admin system now includes:

1. **JWT-based Authentication**: Secure token-based sessions
2. **Rate Limiting**: Prevents abuse (100 requests per 15 minutes per IP)
3. **Audit Logging**: All admin actions are logged with user identification
4. **Token Expiration**: Admin sessions expire after 24 hours
5. **Secure Headers**: All admin API calls require Authorization header

## Setup Instructions

1. Copy your existing `.env` file
2. Add the new environment variables:
   ```bash
   ADMIN_PASSWORD=your-secure-password
   ADMIN_SESSION_SECRET=your-random-secret-key
   ```
3. Restart your application

## Production Security Checklist

- [ ] Change `ADMIN_PASSWORD` to a strong password
- [ ] Change `ADMIN_SESSION_SECRET` to a random 32+ character string
- [ ] Ensure `DATABASE_URL` uses SSL in production
- [ ] Consider using environment-specific `.env` files
- [ ] Regularly rotate admin passwords
- [ ] Monitor admin access logs
