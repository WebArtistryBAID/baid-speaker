-- CreateTable
CREATE TABLE "_LectureToUser"
(
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LectureToUser_AB_pkey" PRIMARY KEY ("A", "B")
);

-- CreateIndex
CREATE INDEX "_LectureToUser_B_index" ON "_LectureToUser" ("B");

-- AddForeignKey
ALTER TABLE "_LectureToUser"
    ADD CONSTRAINT "_LectureToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Lecture" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LectureToUser"
    ADD CONSTRAINT "_LectureToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
