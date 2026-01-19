/*
  Warnings:

  - You are about to drop the column `durationYears` on the `Simulation` table. All the data in the column will be lost.
  - You are about to drop the column `feesPa` on the `Simulation` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyContribution` on the `Simulation` table. All the data in the column will be lost.
  - You are about to drop the column `returnsPa` on the `Simulation` table. All the data in the column will be lost.
  - Added the required column `contribution` to the `Simulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interestRate` to the `Simulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `investDurationYears` to the `Simulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAge` to the `Simulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Simulation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Simulation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "userId" TEXT,
    "startDate" DATETIME NOT NULL,
    "startAge" INTEGER NOT NULL,
    "investDurationYears" INTEGER NOT NULL,
    "interestRate" REAL NOT NULL,
    "contribution" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" TEXT NOT NULL,
    CONSTRAINT "Simulation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Simulation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Simulation" ("createdAt", "id", "productId", "result", "userId") SELECT "createdAt", "id", "productId", "result", "userId" FROM "Simulation";
DROP TABLE "Simulation";
ALTER TABLE "new_Simulation" RENAME TO "Simulation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
