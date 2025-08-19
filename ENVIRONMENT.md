# Environment Variables

This application requires the following environment variables to be set for operation:

## Required Variables

### Database Configuration
- `DATABASE_URL`: PostgreSQL connection string
  - Example: `postgresql://username:password@localhost:5432/database_name`

### Admin Authentication
- `ADMIN_PASSWORD`: Password for admin access
  - Should be a strong, unique password
  - Example: `MySecureAdminPassword123!`

## Simplified Authentication

The admin system now uses a simple, reliable authentication approach:

1. **Password-based Access**: Simple password validation against environment variable
2. **No Complex Security Protocols**: Removed JWT, CSRF, rate limiting, and brute force protection
3. **Reliable on Render**: Designed to work consistently across different hosting environments
4. **Easy to Debug**: Simple authentication flow without complex security layers

## Setup Instructions

1. Copy your existing `.env` file
2. Add the admin password:
   ```bash
   ADMIN_PASSWORD=your-secure-password
   ```
3. Restart your application

## Security Notes

- **Simplified for Reliability**: This approach prioritizes working functionality over complex security
- **Environment-based**: Admin access is controlled by environment variable
- **No Session Management**: Authentication is handled per-request
- **Suitable for Development/Testing**: For production, consider additional security measures

## Production Considerations

- [ ] Use a strong, unique `ADMIN_PASSWORD`
- [ ] Ensure `DATABASE_URL` uses SSL in production
- [ ] Consider implementing additional security layers if needed
- [ ] Monitor admin access logs
- [ ] Regularly rotate admin passwords
