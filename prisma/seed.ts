import { PrismaClient, RoleName, UserStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Seed Roles
  console.log('Seeding roles...');
  const roles = [
    { name: 'SUPER_ADMIN' as RoleName },
    { name: 'AUCTIONEER' as RoleName },
    { name: 'BIDDER' as RoleName },
  ];

  for (const role of roles) {
    const existingRole = await prisma.role.findUnique({
      where: { name: role.name },
    });
    if (!existingRole) {
      await prisma.role.create({
        data: role,
      });
      console.log(`Created role: ${role.name}`);
    } else {
      console.log(`Role "${role.name}" already exists.`);
    }
  }

  // Seed Super Admin
  console.log('Seeding super admin...');
  const superAdminPhone = '0912348714';
  const superAdminPassword = 'Admin@123';
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(superAdminPassword, saltRounds);

  const superAdminRole = await prisma.role.findUnique({
    where: { name: 'SUPER_ADMIN' },
  });

  if (!superAdminRole) {
    console.error('Super admin role not found. Please seed roles first.');
    return;
  }

  const existingSuperAdmin = await prisma.user.findUnique({
    where: { phone: superAdminPhone },
  });

  if (!existingSuperAdmin) {
    await prisma.user.create({
      data: {
        phone: superAdminPhone,
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@example.com',
        status: UserStatus.APPROVED,
        roles: {
          connect: { id: superAdminRole.id },
        },
      },
    });
    console.log('Created super admin user.');
  } else {
    console.log('Super admin user already exists.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
