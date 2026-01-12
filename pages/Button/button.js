import { expect } from "@playwright/test";

export class button {
    constructor(page) {
        this.page = page;
        this.table = page.locator('table');
    }

    async checkAndClick(teks) {
        try {
            const btn = this.page.getByRole('button', { name: teks });

            await expect(btn).toBeVisible();

            const isEnabled = await btn.isEnabled();

            if (isEnabled) {
                await btn.click();
                console.log(`✅ [SUCCESS] Tombol "${teks}" aktif dan berhasil diklik`);
            } else {
                await expect(btn).toBeDisabled();
                console.log(`⚠️ [DISABLED] Tombol "${teks}" tidak aktif`);
            }

            await this.page.waitForTimeout(1000);

        } catch (error) {
            console.log(`❌ [FAILED] Gagal memproses tombol "${teks}"`);
            console.log(`   ↳ Reason: ${error.message}`);
        }
    }

    async moreOption(fitur, button){
        try{
            const role = this.page.getByRole('Row', { name: fitur});
            await role.locator('#btnDropdownAction').click();
            await this.page.getByRole('paragraph').filter({ hasText: button }).click();
            console.log(`✅ [SUCCESS] Tombol "${button}" muncul dan berhasil diklik`)
        } catch(error) {
            console.log(`❌ [FAILED] Tidak dapat melakukan proses "${button}"`);
            console.log(`   ↳ Reason: ${error.message}`);
        }
    }
}