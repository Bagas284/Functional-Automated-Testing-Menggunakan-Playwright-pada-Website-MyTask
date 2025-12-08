import { expect } from "@playwright/test";

export class notifikasi {
    constructor(page){
        this.page = page;
    }
    async notificationCheck(teks){
        // Ambil toast yg mengandung teks yang diinginkan
        const notif = this.page
            .getByTestId('toast-content')
            .filter({ hasText: teks });

        // Pastikan hanya satu elemen yang ditemukan
        await expect(notif).toHaveCount(1);

        // Pastikan toast muncul & mengandung teks yang benar
        await expect(notif).toBeVisible();
        await expect(notif).toContainText(teks);
    }
}