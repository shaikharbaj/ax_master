-- CreateTable
CREATE TABLE "rtos" (
    "id" SERIAL NOT NULL,
    "reg_no" VARCHAR(25) NOT NULL,
    "address" TEXT NOT NULL,
    "rto_state_id" INTEGER NOT NULL,
    "rto_state_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "rtos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rtos_reg_no_key" ON "rtos"("reg_no");

-- AddForeignKey
ALTER TABLE "rtos" ADD CONSTRAINT "rtos_rto_state_id_fkey" FOREIGN KEY ("rto_state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
