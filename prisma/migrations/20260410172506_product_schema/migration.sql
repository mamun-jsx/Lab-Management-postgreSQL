-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyringeOrder" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "contentCode" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "batchLot" TEXT NOT NULL,
    "prodDate" TIMESTAMP(3) NOT NULL,
    "materialDescription" TEXT NOT NULL,
    "custPartNo" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyringeOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
