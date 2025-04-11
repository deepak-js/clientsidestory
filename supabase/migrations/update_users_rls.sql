-- Drop the existing policy
DROP POLICY IF EXISTS "Allow individual user access to their own data" ON users;

-- Create a more permissive policy for authenticated users
CREATE POLICY "Allow authenticated users to create records"
ON users
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create a policy for users to access their own data
CREATE POLICY "Allow users to view and update their own data"
ON users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own data"
ON users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create a policy for service role to manage all records
CREATE POLICY "Allow service role to manage all records"
ON users
USING (auth.role() = 'service_role');
