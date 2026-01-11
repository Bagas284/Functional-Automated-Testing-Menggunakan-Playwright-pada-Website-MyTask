import { expect } from "@playwright/test";
import { checkData } from "../Cek Data/checkData";

export class search extends checkData {
    constructor(page, columnIndex = 0) {
        super(page, columnIndex);
        this.page = page;
        this.searchBox = page.getByRole('textbox', { name: 'Search' });
    }

    async search(teks) {
        try {
            await expect(this.searchBox).toBeVisible();

            await this.searchBox.fill(teks);
            await expect(this.searchBox).toHaveValue(teks);

            const value = await this.searchBox.inputValue();
            console.log(`✅ [SUCCESS] Search field diisi: ${value}`);

            // Tunggu hasil search ter-update
            await this.page.waitForTimeout(1000);

            // Validasi hasil tabel (inherit dari checkData)
            await this.checkSearch();

        } catch (error) {
            console.log(`❌ [FAILED] Gagal melakukan search dengan keyword: "${teks}"`);
            console.log(`   ↳ Reason: ${error.message}`);
        }
    }
}
