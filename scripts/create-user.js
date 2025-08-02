const { createClient } = require("@supabase/supabase-js");
const crypto = require("crypto");

// Supabase configuration
const SUPABASE_URL = "https://clzfbremkfpdodixginl.supabase.co";
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsemZicmVta2ZwZG9kaXhnaW5sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ5MzkxMywiZXhwIjoyMDY5MDY5OTEzfQ.Cr_fLXyFCyAKNvMLZJnqOLy0sAmK9T9cNXc03PuSdho";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Password hashing function (same as in the frontend)
const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const createUser = async (username, email, password) => {
  try {
    const passwordHash = await hashPassword(password);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          username,
          email,
          password_hash: passwordHash,
        },
      ])
      .select("id, username, email, created_at")
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return false;
    }

    console.log("User created successfully:", {
      id: data.id,
      username: data.username,
      email: data.email,
      created_at: data.created_at,
    });

    return true;
  } catch (error) {
    console.error("Unexpected error:", error);
    return false;
  }
};

// Example usage
const main = async () => {
  const args = process.argv.slice(2);

  if (args.length !== 3) {
    console.log("Usage: node create-user.js <username> <email> <password>");
    console.log(
      "Example: node create-user.js admin admin@example.com password123"
    );
    process.exit(1);
  }

  const [username, email, password] = args;

  console.log(`Creating user: ${username} (${email})`);

  const success = await createUser(username, email, password);

  if (success) {
    console.log("✅ User created successfully!");
  } else {
    console.log("❌ Failed to create user");
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

module.exports = { createUser, hashPassword };
