import { expect } from "@playwright/test";

export class detail {
    constructor(page){
        this.page = page;
    }

    async detailCheckData(inputTeks){
        await this.page.waitForTimeout(500);

        const teks = await this.page.innerText('body');

        const expectedTeks = inputTeks?.trim() === "" ? "-" : inputTeks;

        if (teks.includes(expectedTeks)) {
            console.log(`Data sesuai: teks "${expectedTeks}" ditemukan di halaman.`);
        } else {
            console.error(`Data tidak sesuai: teks "${expectedTeks}" TIDAK ditemukan di halaman.`);
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