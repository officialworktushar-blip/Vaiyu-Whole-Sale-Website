import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const USAGE = `Set or update the admin login credentials.

Usage:
  npx tsx scripts/set-admin-password.ts <email> <password>

Examples:
  npx tsx scripts/set-admin-password.ts admin@example.com "MyPassword@123"
  npx tsx scripts/set-admin-password.ts support.vaiyu@gmail.com "Vaiyu@01"

The password must be at least 8 characters long. It is bcrypt-hashed (cost 12)
and the Admin record is upserted: created if the email does not exist, updated
if it does.`;

async function main() {
  const [emailArg, passwordArg] = process.argv.slice(2);

  const email = emailArg?.trim().toLowerCase() || "";
  const password = passwordArg ?? "";

  if (!email || !password) {
    console.error(USAGE);
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters long.");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set in the environment / .env file.");
    process.exit(1);
  }

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await prisma.admin.upsert({
      where: { email },
      update: { passwordHash },
      create: { email, passwordHash },
    });

    console.log(`Admin upserted successfully:`);
    console.log(`  email:     ${admin.email}`);
    console.log(`  updatedAt: ${new Date().toISOString()}`);
    console.log(`\nYou can now sign in at /admin/login with this email and the password you set.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
