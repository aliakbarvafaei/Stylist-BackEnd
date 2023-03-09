const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const initialUser = {
    title: "johndoe@example.com",
  };

  await prisma.Category.create({
    data: initialUser,
  });

  console.log("Initial user created");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
