-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "remotejid" TEXT NOT NULL,
    "premium_limit" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_remotejid_key" ON "User"("remotejid");
