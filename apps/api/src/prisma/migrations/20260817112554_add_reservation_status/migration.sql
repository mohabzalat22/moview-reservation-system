-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING';
