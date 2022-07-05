-- CreateIndex
CREATE INDEX "File_id_originalFileName_createdAt_idx" ON "File"("id", "originalFileName", "createdAt");

-- CreateIndex
CREATE INDEX "Message_id_createdAt_idx" ON "Message"("id", "createdAt");
