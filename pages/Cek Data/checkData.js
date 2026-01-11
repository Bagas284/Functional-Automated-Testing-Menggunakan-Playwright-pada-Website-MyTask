import { expect } from "@playwright/test";

export class checkData {
    constructor(page, columnIndex = 0) {
        this.page = page;
        this.rows = page.locator('table tbody tr');
        this.columnIndex = columnIndex;
    }

    async checkSearch() {
        try {
            const rowCount = await this.rows.count();

            if (rowCount > 0) {
                await expect(this.rows.first()).toBeVisible();
                console.log(`✅ [SUCCESS] Jumlah data ditemukan: ${rowCount}`);

                for (let i = 0; i < rowCount; i++) {
                    const cell = this.rows
                        .nth(i)
                        .locator(`td:nth-child(${this.columnIndex + 1})`);

                    await expect(cell).toBeVisible();

                    const text = await cell.textContent();
                    console.log(`${i + 1}. ${text?.trim() || '-'}`);
                }
            } else {
                console.log('⚠️ [EMPTY] Tidak ada data pada tabel hasil pencarian.');
            }

        } catch (error) {
            console.log('❌ [FAILED] Gagal melakukan pengecekan data tabel');
            console.log(`   ↳ Reason: ${error.message}`);
        }
    }
}