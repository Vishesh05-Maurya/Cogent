const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const playground = await prisma.playground.findFirst({
    orderBy: { createdAt: 'desc' },
  });
  if (playground) {
    console.log('Valid Playground ID:', playground.id);
    console.log('Template:', playground.template);
  } else {
    console.log('No playgrounds found.');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
