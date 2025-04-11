# Supabase Database Migrations

This directory contains SQL migrations for the Supabase database.

## How to Apply Migrations

### Option 1: Using Supabase CLI

If you have the Supabase CLI installed, you can apply migrations using:

```bash
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Copy the contents of the migration file
4. Paste into the SQL Editor
5. Click "Run" to execute the SQL

## Migration Files

- `update_users_rls.sql`: Updates Row Level Security policies for the users table to allow authenticated users to create records and manage their own data.

## Important Notes

- Always back up your database before applying migrations
- Test migrations in a development environment before applying to production
- Some migrations may require admin privileges
