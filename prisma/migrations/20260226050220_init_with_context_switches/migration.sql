-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "image" TEXT,
    "apiToken" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DailyIntention" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "todos" TEXT NOT NULL,
    CONSTRAINT "DailyIntention_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sessionStart" DATETIME NOT NULL,
    "sessionEnd" DATETIME NOT NULL,
    "durationMinutes" REAL NOT NULL,
    "primaryCategory" TEXT,
    "primaryProject" TEXT,
    "appsUsed" TEXT,
    "aiContextSummary" TEXT,
    "contextSwitches" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_apiToken_key" ON "User"("apiToken");

-- CreateIndex
CREATE UNIQUE INDEX "DailyIntention_userId_date_key" ON "DailyIntention"("userId", "date");
