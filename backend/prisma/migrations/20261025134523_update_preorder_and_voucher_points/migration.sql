-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_cashier_id_fkey`;

-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `expires_at` DATETIME(3) NULL,
    ADD COLUMN `status` ENUM('PENDING_PAYMENT', 'BOOKED', 'READY', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'COMPLETED',
    MODIFY `cashier_id` VARCHAR(191) NULL,
    MODIFY `pay_amount` DECIMAL(12, 2) NULL,
    MODIFY `change_amount` DECIMAL(12, 2) NULL,
    MODIFY `payment_method` ENUM('CASH', 'QRIS', 'PAY_ON_PICKUP', 'QRIS_WEB') NOT NULL DEFAULT 'CASH';

-- AlterTable
ALTER TABLE `vouchers` ADD COLUMN `student_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `vouchers` ADD CONSTRAINT `vouchers_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_cashier_id_fkey` FOREIGN KEY (`cashier_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
