-- CreateEnum
CREATE TYPE "UserAuditLogType" AS ENUM ('login');

-- CreateTable
CREATE TABLE "User"
(
    "id"          TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "pinyin"      TEXT NOT NULL,
    "phone"       TEXT,
    "permissions" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAuditLog"
(
    "id"     SERIAL             NOT NULL,
    "time"   TIMESTAMP(3)       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type"   "UserAuditLogType" NOT NULL,
    "userId" TEXT               NOT NULL,
    "values" TEXT[],

    CONSTRAINT "UserAuditLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserAuditLog"
    ADD CONSTRAINT "UserAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
