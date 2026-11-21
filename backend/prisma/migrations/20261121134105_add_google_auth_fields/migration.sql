-- Google accounts have no password; allow it to be null.
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- Link an account to its Google identity (the token's `sub`).
ALTER TABLE "User" ADD COLUMN "googleId" TEXT;

CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
