# MongoDB Shell Scripts for HR Portal Super Admin Operations

## Prerequisites
- Node.js installed
- MongoDB connection string set in environment variables
- bcryptjs package installed

## Usage

### Create Super Admin
```bash
node scripts/super-admin-shell.js create-super-admin <email> <password> <full-name>
```

**Example:**
```bash
node scripts/super-admin-shell.js create-super-admin admin@company.com admin123 "Super Admin"
```

### List All Super Admins
```bash
node scripts/super-admin-shell.js list-super-admins
```

### Update User Role
```bash
node scripts/super-admin-shell.js update-user-role <user-id> <new-role>
```

**Example:**
```bash
node scripts/super-admin-shell.js update-user-role 508f8d3a2b4c8a7 hr_admin
```

### Reset User Password
```bash
node scripts/super-admin-shell.js reset-user-password <email> <new-password>
```

### Get User Statistics
```bash
node scripts/super-admin-shell.js get-user-stats
```

## Security Notes
- These scripts provide direct MongoDB access
- Use with caution in production
- Store environment variables securely
- Consider adding authentication for script access

## Environment Variables Required
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hr_portal
```

## Features
- ✅ Create super admin accounts
- ✅ List all super admins
- ✅ Update user roles (only super_admin can change roles)
- ✅ Reset user passwords
- ✅ Get user statistics
- ✅ Proper error handling and logging
- ✅ Secure password hashing with bcrypt
- ✅ MongoDB connection management
