import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://clzfbremkfpdodixginl.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsemZicmVta2ZwZG9kaXhnaW5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0OTM5MTMsImV4cCI6MjA2OTA2OTkxM30.ouLD3dBXvJi6O2_6muVzhTNWMGn75qkyvjBxojisFHQ";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  try {
    console.log("Testing database connection...");

    // Test if users table exists
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    if (error) {
      console.error("Error accessing users table:", error);
      console.log(
        "\nPlease run the SQL in database-setup.sql in your Supabase dashboard first."
      );
      return;
    }

    console.log("✅ Users table exists and is accessible");
    console.log("Users found:", users?.length || 0);

    if (users && users.length > 0) {
      console.log("Sample user:", {
        id: users[0].id,
        username: users[0].username,
        email: users[0].email,
        created_at: users[0].created_at,
      });
    }

    // Test admin user specifically
    const { data: adminUser, error: adminError } = await supabase
      .from("users")
      .select("*")
      .eq("username", "admin")
      .single();

    if (adminError) {
      console.error("Error finding admin user:", adminError);
    } else if (adminUser) {
      console.log("✅ Admin user exists");
      console.log("Admin user details:", {
        username: adminUser.username,
        email: adminUser.email,
        has_password_hash: !!adminUser.password_hash,
      });
    } else {
      console.log("❌ Admin user not found");
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testDatabase();
