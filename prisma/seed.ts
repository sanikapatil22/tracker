import prisma from "../lib/prisma";

async function main() {
  const alice = await prisma.user.create({
    data: { name: "Alice", email: "alice@example.com" },
  });

  const bob = await prisma.user.create({
    data: { name: "Bob", email: "bob@example.com" },
  });

  await prisma.problem.createMany({
    data: [
      { title: "Two Sum", solved: true, platform: "LeetCode", userId: alice.id },
      { title: "Add Two Numbers", solved: false, platform: "LeetCode", userId: alice.id },
      { title: "Codeforces Problem A", solved: true, platform: "Codeforces", userId: bob.id },
      { title: "Codeforces Problem B", solved: true, platform: "Codeforces", userId: bob.id },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
