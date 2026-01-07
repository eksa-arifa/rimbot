/*
  Warnings:

  - You are about to drop the column `taskTitle` on the `TaskSchedule` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TaskSchedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "taskUrl" TEXT NOT NULL,
    CONSTRAINT "TaskSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TaskSchedule" ("createdAt", "id", "taskUrl", "userId") SELECT "createdAt", "id", "taskUrl", "userId" FROM "TaskSchedule";
DROP TABLE "TaskSchedule";
ALTER TABLE "new_TaskSchedule" RENAME TO "TaskSchedule";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
