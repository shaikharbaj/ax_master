-- CreateTable
CREATE TABLE "yards" (
    "id" SERIAL NOT NULL,
    "yard_name" VARCHAR(100) NOT NULL,
    "yard_address" TEXT NOT NULL,
    "yard_city_id" INTEGER NOT NULL,
    "yard_city_name" TEXT NOT NULL,
    "yard_state_id" INTEGER NOT NULL,
    "yard_state_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "yard_associations" DECIMAL(65,30) DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "yards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "yards_yard_name_key" ON "yards"("yard_name");

-- AddForeignKey
ALTER TABLE "yards" ADD CONSTRAINT "yards_yard_city_id_fkey" FOREIGN KEY ("yard_city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "yards" ADD CONSTRAINT "yards_yard_state_id_fkey" FOREIGN KEY ("yard_state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
