const { createClient } = require("@supabase/supabase-js");
const crypto = require("crypto");

// Load environment variables
require("dotenv").config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  console.log(
    "Please make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Hash password function (same as in the frontend)
const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

async function setupDatabase() {
  try {
    console.log("Setting up database...");

    // Create users table
    const createTableSQL = `
      -- Create users table for authentication
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );

      -- Enable Row Level Security
      ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
      DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
      DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
      DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;

      -- Create policies for user access
      CREATE POLICY "Enable read access for all users"
      ON public.users
      FOR SELECT
      USING (true);

      CREATE POLICY "Enable insert for authenticated users only"
      ON public.users
      FOR INSERT
      WITH CHECK (true);

      CREATE POLICY "Users can update their own profile"
      ON public.users
      FOR UPDATE
      USING (true);

      -- Create trigger for automatic timestamp updates
      CREATE OR REPLACE FUNCTION public.update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
      CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON public.users
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();

      -- Enable realtime for the users table
      ALTER TABLE public.users REPLICA IDENTITY FULL;
      ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
    `;

    const { error: tableError } = await supabase.rpc("exec_sql", {
      sql: createTableSQL,
    });

    if (tableError) {
      console.log(
        "Table might already exist or there was an error:",
        tableError.message
      );
    } else {
      console.log("Users table created successfully");
    }

    // Create admin user
    const adminPassword = "password123";
    const passwordHash = await hashPassword(adminPassword);

    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("username", "admin")
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking for existing admin user:", checkError);
      return;
    }

    if (existingUser) {
      console.log("Admin user already exists");
    } else {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            username: "admin",
            email: "admin@example.com",
            password_hash: passwordHash,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error creating admin user:", insertError);
        return;
      }

      console.log("Admin user created successfully:", newUser.username);
    }

    console.log("\n✅ Database setup complete!");
    console.log("You can now login with:");
    console.log("Username: admin");
    console.log("Email: admin@example.com");
    console.log("Password: password123");
  } catch (error) {
    console.error("Setup failed:", error);
  }
}

setupDatabase();
