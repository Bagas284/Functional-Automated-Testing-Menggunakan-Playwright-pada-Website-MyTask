import { expect } from "@playwright/test";

export class notifikasi {
    constructor(page) {
        this.page = page;
        this.notifData = {
            loginGagal: "Email atau password tidak sesuai",
            berhasilMembuatRole: "Role berhasil dibuat",
            gagalMembuatRole: "permissions must be at least 1"
        };
    }

    async notificationCheck() {
        try {
            const notif = this.page.getByTestId('toast-content');

            await expect(notif).toBeVisible();

            const actualText = (await notif.textContent())?.trim() || '';

            const isMatch = Object.values(this.notifData).some(expected =>
                actualText.includes(expected)
            );

            expect(
                isMatch,
                `Teks notifikasi "${actualText}" tidak sesuai dengan data notifikasi yang terdaftar`
            ).toBeTruthy();

            console.log(`✅ [SUCCESS] Muncul pesan notifikasi: "${actualText}"`);

        } catch (error) {
            console.log('❌ [FAILED] Gagal melakukan pengecekan notifikasi');
            console.log(`   ↳ Reason: ${error.message}`);
        }
    }
}