# Database Migrations

This directory contains SQL migration scripts for the ClientsideStory database.

## How to Run Migrations

1. Log in to your Supabase dashboard
2. Select your project
3. Go to the "SQL Editor" section
4. Create a new query
5. Copy and paste the contents of each migration file
6. Run the query

## Migration Files

- `01_create_testimonials_table.sql`: Creates the testimonials table and sets up Row Level Security policies
- `02_update_users_table.sql`: Adds verification and customization fields to the users table

## Order of Execution

Run the migrations in numerical order:
1. First run `01_create_testimonials_table.sql`
2. Then run `02_update_users_table.sql`

## Verifying Migrations

After running the migrations, you can verify that they were successful by:
1. Going to the "Table Editor" in the Supabase dashboard
2. Checking that the `testimonials` table exists with the correct columns
3. Checking that the `users` table has the new columns: `is_verified`, `verification_date`, `accent_color`, and `profile_views`
