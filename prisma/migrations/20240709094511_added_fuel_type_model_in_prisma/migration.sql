-- CreateTable
CREATE TABLE "fuel_types" (
    "id" SERIAL NOT NULL,
    "fuel_type" VARCHAR(25) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "fuel_type_associations" DECIMAL(65,30) DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "fuel_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fuel_types_fuel_type_key" ON "fuel_types"("fuel_type");
