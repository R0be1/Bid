import { PrismaClient, RoleName, UserStatus } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // Ensure roles exist
  console.log("Seeding roles...");
  const roleNames = [
    RoleName.SUPER_ADMIN,
    RoleName.AUCTIONEER,
    RoleName.BIDDER,
  ];
  for (const name of roleNames) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Seed Super Admin
  console.log("Seeding super admin...");
  const superAdminPhone = "0912345678";
  const superAdminPassword = "Admin@123";
  const hashedPassword = await bcryptjs.hash(superAdminPassword, 10); // works the same

  const existingSuperAdmin = await prisma.user.findUnique({
    where: { phone: superAdminPhone },
  });

  if (!existingSuperAdmin) {
    const superAdminRole = await prisma.role.findUnique({
      where: { name: RoleName.SUPER_ADMIN },
    });

    if (!superAdminRole) {
      throw new Error("SUPER_ADMIN role not found");
    }

    await prisma.user.create({
      data: {
        phone: superAdminPhone,
        password: hashedPassword,
        firstName: "Super",
        lastName: "Admin",
        email: "superadmin@example.com",
        status: UserStatus.APPROVED,
        roles: {
          connect: [{ id: superAdminRole.id }],
        },
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
