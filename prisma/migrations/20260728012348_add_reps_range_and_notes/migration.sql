-- AlterTable
ALTER TABLE "RoutineItem" ADD COLUMN "targetRepsMax" INTEGER;
ALTER TABLE "RoutineItem" ADD COLUMN "targetRepsMin" INTEGER;

-- AlterTable
ALTER TABLE "WorkoutSet" ADD COLUMN "notes" TEXT;
