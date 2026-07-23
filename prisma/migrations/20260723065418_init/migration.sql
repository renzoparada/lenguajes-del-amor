-- CreateEnum
CREATE TYPE "LoveLanguage" AS ENUM ('WORDS_OF_AFFIRMATION', 'QUALITY_TIME', 'RECEIVING_GIFTS', 'ACTS_OF_SERVICE', 'PHYSICAL_TOUCH');

-- CreateTable
CREATE TABLE "LoveLanguageResult" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "wordsOfAffirmationScore" INTEGER NOT NULL,
    "qualityTimeScore" INTEGER NOT NULL,
    "receivingGiftsScore" INTEGER NOT NULL,
    "actsOfServiceScore" INTEGER NOT NULL,
    "physicalTouchScore" INTEGER NOT NULL,
    "primaryLanguage" "LoveLanguage" NOT NULL,
    "secondaryLanguage" "LoveLanguage" NOT NULL,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoveLanguageResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LoveLanguageResult_email_idx" ON "LoveLanguageResult"("email");
