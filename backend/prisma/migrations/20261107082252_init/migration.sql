-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ELECTRONICS', 'HOME', 'WORK', 'FOOD', 'PERSONAL_CARE', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "category" "Category" NOT NULL DEFAULT 'OTHER',
    "notes" TEXT,
    "priceCents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "purchaseDate" TIMESTAMP(3),
    "store" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "expiryDate" TIMESTAMP(3),
    "warrantyExpiresAt" TIMESTAMP(3),
    "serialNumber" TEXT,
    "barcode" TEXT,
    "imageUrl" TEXT,
    "receiptUrl" TEXT,
    "remindDaysBefore" INTEGER NOT NULL DEFAULT 7,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Item_userId_idx" ON "Item"("userId");

-- CreateIndex
CREATE INDEX "Item_expiryDate_idx" ON "Item"("expiryDate");

-- CreateIndex
CREATE INDEX "Item_warrantyExpiresAt_idx" ON "Item"("warrantyExpiresAt");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
