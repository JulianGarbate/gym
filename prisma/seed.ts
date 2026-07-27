import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEMO_USER_EMAIL = 'demo@gymtracker.app';

interface RawExercise {
  id: string;
  name: string;
  category?: string;
  equipment?: string;
  images?: string[];
  instructions?: string[];
}

async function main() {
  console.log('Cargando ejercicios desde repositorio open source...');
  const res = await fetch(
    'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
  );
  const exercises: RawExercise[] = await res.json();

  for (const ex of exercises.slice(0, 100)) {
    await prisma.exercise.upsert({
      where: { id: ex.id },
      update: {},
      create: {
        id: ex.id,
        name: ex.name,
        category: ex.category || 'General',
        equipment: ex.equipment || 'Ninguno',
        videoUrl:
          ex.images && ex.images.length > 0
            ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${ex.images[0]}`
            : null,
        instructions: ex.instructions ? ex.instructions.join(' ') : null,
      },
    });
  }
  console.log('Seeding de ejercicios finalizado correctamente.');

  await prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {},
    create: {
      email: DEMO_USER_EMAIL,
      name: 'Demo User',
    },
  });
  console.log('Usuario demo creado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
