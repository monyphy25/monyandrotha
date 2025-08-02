# Authentication System Setup Guide

This guide explains how to set up and use the authentication system for the Skincare App.

## Features

- ✅ User login with username and password
- ✅ Protected routes
- ✅ Manual user creation
- ✅ Session management with localStorage
- ✅ Password hashing (SHA-256)
- ✅ User management interface

## Database Setup

### 1. Run the Migration

First, apply the database migration to create the users table:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL in your Supabase dashboard
```

The migration creates a `users` table with the following structure:

- `id` (UUID, Primary Key)
- `username` (TEXT, Unique)
- `email` (TEXT, Unique)
- `password_hash` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 2. Row Level Security

The users table has Row Level Security enabled with policies that allow users to view and update their own profiles.

## Manual User Creation

### Option 1: Using the User Management Interface

1. Start the application
2. Navigate to `/user-management` (you'll need to be logged in)
3. Use the form to create new users

### Option 2: Using the Script

1. Install dependencies:

```bash
npm install @supabase/supabase-js
```

2. Set your Supabase service key as an environment variable:

```bash
export SUPABASE_SERVICE_KEY="your-service-key-here"
```

3. Run the script:

```bash
node scripts/create-user.js <username> <email> <password>
```

Example:

```bash
node scripts/create-user.js admin admin@example.com password123
```

### Option 3: Direct Database Insert

You can also insert users directly into the database using the Supabase dashboard or SQL:

```sql
-- First, hash the password (use the same hashing function as the app)
-- For password "password123", the hash would be: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9

INSERT INTO users (username, email, password_hash)
VALUES ('admin', 'admin@example.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9');
```

## Application Usage

### 1. Login

1. Navigate to `/login`
2. Enter your username and password
3. Upon successful login, you'll be redirected to the main application

### 2. Protected Routes

The following routes are protected and require authentication:

- `/` - Main product management page
- `/user-management` - User management interface

### 3. Navigation

- The navigation bar shows your username when logged in
- Click "Logout" to sign out
- Click "User Management" to access the user creation interface

### 4. Session Management

- User sessions are stored in localStorage
- Sessions persist across browser restarts
- Logout clears the session

## Security Considerations

### Password Hashing

- Passwords are hashed using SHA-256 (for production, consider using bcrypt or Argon2)
- Never store plain text passwords
- The same hashing function is used in both frontend and backend

### Authentication Flow

1. User enters credentials
2. Frontend hashes the password
3. Backend compares with stored hash
4. If match, user is logged in and session is stored

### Row Level Security

- Users can only access their own profile data
- Database policies enforce access control
- No direct access to other users' data

## Troubleshooting

### Common Issues

1. **"Invalid username or password"**

   - Check that the user exists in the database
   - Verify the password is correct
   - Ensure the password hash was generated correctly

2. **"Username or email already exists"**

   - Choose a different username or email
   - Check the database for existing users

3. **Protected route redirects to login**
   - Make sure you're logged in
   - Check that the session is stored in localStorage
   - Try logging out and logging back in

### Debug Mode

To debug authentication issues, check the browser console and network tab for:

- API request/response details
- localStorage contents
- Authentication context state

## Production Considerations

1. **Use HTTPS** - Always use HTTPS in production
2. **Stronger Password Hashing** - Consider using bcrypt or Argon2
3. **Rate Limiting** - Implement rate limiting for login attempts
4. **Session Management** - Consider using secure HTTP-only cookies
5. **Environment Variables** - Store sensitive keys in environment variables
6. **Input Validation** - Add server-side validation for all inputs

## API Endpoints

The authentication system uses the following Supabase operations:

- `SELECT` from `users` table for login verification
- `INSERT` into `users` table for user creation
- Row Level Security policies for access control

## File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication context
├── components/
│   ├── ProtectedRoute.tsx       # Route protection component
│   └── Navigation.tsx           # Navigation with auth state
├── pages/
│   ├── Login.tsx                # Login page
│   └── UserManagement.tsx       # User management interface
├── lib/
│   └── auth.ts                  # Authentication utilities
└── types/
    └── auth.ts                  # Authentication types
```

## Support

If you encounter any issues with the authentication system, please check:

1. Database connection and migrations
2. Environment variables and API keys
3. Browser console for errors
4. Network tab for failed requests
