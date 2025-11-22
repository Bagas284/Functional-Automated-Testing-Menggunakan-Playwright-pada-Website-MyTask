import { expect } from "@playwright/test";

export class notifikasi {
    constructor(page){
        this.page = page;
    }
    async notificationCheck(teks){
        const notif = this.page.getByTestId('toast-content');
        await expect(notif).toBeVisible();
        await expect(notif).toContainText(teks);
    }
}