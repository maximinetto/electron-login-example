import hash from "../services/hash";
import prisma from "./client";

async function main() {
  await prisma.$connect();

  const password = await hash("admin");

  const user = await prisma.user.findFirst({
    where: {
      username: "admin",
    },
  });

  if (!user) {
    await prisma.user.create({
      data: {
        name: "admin",
        lastName: "admin",
        username: "admin",
        password,
      },
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
