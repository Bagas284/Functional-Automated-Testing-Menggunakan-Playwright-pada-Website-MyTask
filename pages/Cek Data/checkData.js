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

    async detailCheckData(inputTeks) {
        await this.page.waitForTimeout(1200);
        const teks = await this.page.innerText('body');
        const expectedTeks =
            inputTeks?.trim() === "" || inputTeks == null ? "-" : inputTeks;

        if (teks.includes(expectedTeks)) {
            console.log(`✅ [SUCCESS] Data sesuai: teks "${expectedTeks}" ditemukan di halaman.`);
        } else {
            throw new Error(`❌ [FAILED] Data tidak sesuai: teks "${expectedTeks}" TIDAK ditemukan di halaman.`);
        }
    }

    async dataCheckbox(){
        await this.page.waitForTimeout(500);
        // Ambil semua baris tabel (kecuali header)
        const rows = await this.page.locator('table tbody tr');
        const totalRows = await rows.count(); // jumlah baris

        for (let i = 0; i < totalRows; i++) {
            const row = rows.nth(i);
            // Ambil nama fitur di kolom pertama
            const fitur = await row.locator('td:nth-child(1)').innerText();

            // Ambil semua checkbox
            const view = row.locator('input[type="checkbox"]').nth(1);
            const create = row.locator('input[type="checkbox"]').nth(2);
            const edit = row.locator('input[type="checkbox"]').nth(3);
            const del = row.locator('input[type="checkbox"]').nth(4);

            // Cek status
            const v = await view.isChecked();
            const c = await create.isChecked();
            const e = await edit.isChecked();
            const d = await del.isChecked();

            // Print hanya jika ada yang tercentang
            if (v || c || e || d) {
                console.log(`Fitur: ${fitur}`);
                if (v) console.log("   - View ✔️");
                if (c) console.log("   - Create ✔️");
                if (e) console.log("   - Edit ✔️");
                if (d) console.log("   - Delete ✔️");
                console.log("-------------------------");
            }
        }
    }
}