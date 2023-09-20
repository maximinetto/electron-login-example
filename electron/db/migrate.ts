import prisma from "./client";
import createUser from "./user";

async function main() {
  await prisma.$connect();

  const user = await createUser();

  const row = await prisma.user.findFirst({
    where: {
      username: user.username,
    },
  });

  if (!row) {
    await prisma.user.create({
      data: user,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
