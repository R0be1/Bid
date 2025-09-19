import { PrismaClient, RoleName, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // Seed Super Admin
  console.log("Seeding super admin...");
  const superAdminPhone = "0912348714";
  const superAdminPassword = "Admin@123";
  const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

  const existingSuperAdmin = await prisma.user.findUnique({
    where: { phone: superAdminPhone },
  });

  if (!existingSuperAdmin) {
    await prisma.user.create({
      data: {
        phone: superAdminPhone,
        password: hashedPassword,
        firstName: "Super",
        lastName: "Admin",
        email: "superadmin@example.com",
        status: UserStatus.APPROVED,
        role: RoleName.SUPER_ADMIN,
      },
    });
    console.log("Created super admin user.");
  } else {
    console.log("Super admin user already exists.");
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
