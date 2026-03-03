import { expect } from "@playwright/test";

export class checkData {
    constructor(page, columnIndex = 0) {
        this.page = page;
        this.rows = page.locator('table tbody tr:not(:has(img))');
        this.columnIndex = columnIndex;
    }

    //Cek data search
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
            throw error;
        }
    }

    //Cek detail dalam bentuk teks
    async detailCheckData(inputTeks) {
        const expectedTeks =
            inputTeks?.trim() === "" || inputTeks == null ? "-" : inputTeks;

        try {
            await this.page.waitForTimeout(1000);
            const teks = await this.page.innerText('body');

            await expect(this.page.locator('body')).toContainText(expectedTeks);

            console.log(`✅ [SUCCESS] Data sesuai: teks "${expectedTeks}" ditemukan di halaman.`);

        } catch (error) {
            console.log(`❌ [FAILED] Data tidak sesuai: teks "${expectedTeks}" TIDAK ditemukan di halaman.`);
            console.log(`   ↳ Reason: ${error.message}`);
            throw error;
        }
    }

    //Cek detail dalam bentuk field
    async detailCheckDataField(nameField, value, options = {}) {
        const { exact = false } = options;

        try {
            const locator = this.page.getByRole('textbox', {
                name: nameField,
                exact
            });

            await expect(locator).toBeVisible();
            await expect(locator).toHaveValue(value);

            console.log(`✅ [SUCCESS] Field "${nameField}" memiliki value "${value}"`);
        } catch (error) {
            console.log(`❌ [FAILED] Field "${nameField}" TIDAK memiliki value "${value}"`);
            throw error;
        }
    }

    //Cel checkbox
    async dataCheckbox() {
        try {
            await this.page.waitForTimeout(500);

            const rows = await this.page.locator('table tbody tr');
            const totalRows = await rows.count();

            for (let i = 0; i < totalRows; i++) {
                const row = rows.nth(i);

                const fitur = await row.locator('td:nth-child(1)').innerText();

                const checkboxes = row.locator('input[type="checkbox"]');

                const view = checkboxes.nth(1);
                const create = checkboxes.nth(2);
                const edit = checkboxes.nth(3);
                const del = checkboxes.nth(4);

                const v = await view.isChecked();
                const c = await create.isChecked();
                const e = await edit.isChecked();
                const d = await del.isChecked();

                if (v || c || e || d) {
                    console.log(`Fitur: ${fitur}`);
                    if (v) console.log("   - View ✔️");
                    if (c) console.log("   - Create ✔️");
                    if (e) console.log("   - Edit ✔️");
                    if (d) console.log("   - Delete ✔️");
                    console.log("-------------------------");
                }
            }

        } catch (error) {
            console.error("❌ [FAILED] Terjadi error saat membaca data checkbox");
            console.log(`   ↳ Reason: ${error.message}`);
            throw error;
        }
    }

    //Cek File pendukung
    async cekFilePendukug(tipeFile, indek) {
        try {
            const file = this.page.getByRole('img', { name: tipeFile });
            await this.page.waitForTimeout(1000);

            const totalFile = await file.count();
            const indeks = indek - 1;

            if (totalFile === 0) {
                console.log(`⚠️ [EMPTY] Tidak ada gambar dengan nama "${tipeFile}"`);
                return;
            }

            console.log(`✅ [SUCCESS] Muncul ${totalFile} gambar berupa "${tipeFile}"`);

            await expect(file.nth(indeks)).toBeVisible();

            let newTab;
            try {
                [newTab] = await Promise.all([
                    this.page.waitForEvent('popup'),
                    file.nth(indeks).click()
                ]);

                console.log(
                    `✅ [SUCCESS] Klik gambar "${tipeFile}" ke-${indek} membuka tab baru`
                );

            } catch (popupError) {
                console.log(
                    `❌ [FAILED] Klik gambar "${tipeFile}" ke-${indek} TIDAK membuka tab baru`
                );
                throw popupError;
            }

            try {
                await newTab.waitForLoadState('domcontentloaded');
                await expect(newTab).toHaveURL(/\.jpg|\.png|\.jpeg\.pdf/);

                console.log(
                    `✅ [SUCCESS] Tab baru terbuka dengan URL gambar valid`
                );

            } catch (tabError) {
                console.log(
                    `❌ [FAILED] Tab baru terbuka tapi URL bukan gambar`
                );
                console.error(tabError.message);
            }

        } catch (error) {
            console.log(
                `❌ [ERROR] Gagal cek file pendukung "${tipeFile}"`
            );
            console.error(error.message);
        }
    }

    //Cek detail kategori laporan
    async cekKategoriLaporan(teks = []) {
        for (let i = 0; i < teks.length; i++) {
            const locator = this.page
                .getByRole('textbox', { name: 'Judul' })
                .nth(i);

            try {
                await expect(locator).toHaveValue(teks[i]);

                console.log(
                    `✅ [SUCCESS] Field ke-${i + 1} sesuai. Value: "${teks[i]}"`
                );
            } catch (error) {
                console.error(
                    `❌ [FAILED] Field ke-${i + 1} TIDAK sesuai.\n` +
                    `   Expected: "${teks[i]}"`
                );
            throw error;
            }
        }
    }

    async checkRadioButton(radioButton){
        try{
            const locator = this.page.getByRole('radio', {name: radioButton});
            await expect(locator).toBeVisible();

            await expect(locator).toBeChecked();
            console.log(`✅ [SUCCESS] Radio button: ${radioButton} dipilih`);
        } catch(error){
            console.log(`❌ [FAILED] Radio button: ${radioButton} tidak ditemukan`);
            throw error;
        }
    }
}