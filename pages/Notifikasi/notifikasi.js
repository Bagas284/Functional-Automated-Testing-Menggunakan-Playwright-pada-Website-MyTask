import { expect } from "@playwright/test";

export class notifikasi {
    constructor(page) {
        this.page = page;
        this.notifData = [
            "Email atau password tidak sesuai",
            "Role berhasil dibuat",
            "Role berhasil diubah",
            "permissions must be at least 1",
            "Role berhasil dihapus",
            "this role has user, please update user role first",
            "Pengguna berhasil dipindahkan ke role yang dituju",
            "Success create task type",
            "Task title field is required",
            "Type identity field is required",
            "Type already exists",
            "Success update task type",
        ];
    }

    async notificationCheck() {
        try {
            const notifs = this.page.getByTestId('toast-content');

            // Pastikan minimal 1 notifikasi muncul
            await expect(notifs.first()).toBeVisible();

            const notifCount = await notifs.count();

            for (let i = 0; i < notifCount; i++) {
                const notif = notifs.nth(i);
                const actualText = (await notif.textContent())?.trim() || "";

                const isMatch = this.notifData.some(expected =>
                    actualText.includes(expected)
                );

                expect(
                    isMatch,
                    `Teks notifikasi "${actualText}" tidak terdaftar`
                ).toBeTruthy();

                console.log(`✅ [SUCCESS] Notifikasi valid: "${actualText}"`);
            }

        } catch (error) {
            console.log('❌ [FAILED] Gagal melakukan pengecekan notifikasi');
            console.log(`   ↳ Reason: ${error.message}`);
            throw error;
        }
    }
}