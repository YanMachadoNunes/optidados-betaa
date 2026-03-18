-- Create default user first
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "image" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create unique index
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Insert default user for existing records
INSERT INTO "User" ("id", "name", "email", "plan", "createdAt", "updatedAt")
VALUES ('default-user', 'Administrador', 'admin@optigestao.com', 'PREMIUM', NOW(), NOW());

-- Add userId column with default value for existing records
ALTER TABLE "Order" ADD COLUMN "userId" TEXT NOT NULL DEFAULT 'default-user';
ALTER TABLE "Sale" ADD COLUMN "userId" TEXT NOT NULL DEFAULT 'default-user';

-- Add foreign keys
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
