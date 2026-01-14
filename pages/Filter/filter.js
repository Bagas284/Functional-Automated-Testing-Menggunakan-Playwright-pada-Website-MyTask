import { expect } from "@playwright/test";
import { search } from "../Search/search";

export class filter {
    constructor(page) {
        this.page = page;
        //Filter
        this.buttonFilter = page.locator('#btnDropdownFilter');
        this.dropdownFilter = page.locator('#dropdownFilter');
        //Laporan Aktifitas
        this.containerLaporanAktifitas = page.locator('#dropdownCategory');
        this.itemsLaporanAktifitas = this.containerLaporanAktifitas.locator('li');
        //Karyawan
        this.containerKaryawan = page.locator('#dropdownEmployee');
        this.itemsKaryawan = this.containerKaryawan.locator('li');
    }

    async filterOption(){
        await this.buttonFilter.click();
        await expect(this.dropdownFilter).toBeVisible();
        console.log('✅ [SUCCESS] Muncul menu filter')
    }

    async runFIlterTest(column) {
        const inputSearch = new search(this.page, column);
        await inputSearch.checkSearch();
    }

    async filterDropdown(label, teks) {
        const dropdown = this.page.getByRole('textbox', { name: label });
        await expect(dropdown).toBeVisible();
        await this.page.waitForTimeout(700);
        await dropdown.fill(teks);

        const dropdownMap = {
            'Kategori': {
                container: this.containerLaporanAktifitas,
                items: this.itemsLaporanAktifitas,
                message: 'Kategori'
            },
            'Karyawan': {
                container: this.containerKaryawan,
                items: this.itemsKaryawan,
                message: 'Karyawan'
            }
        };

        const selected = dropdownMap[label];
        await expect(selected.container).toBeVisible();
        const value = await dropdown.inputValue();
        const totalData = await selected.items.count();

        if (!value) {
            console.log(`⚠️ [EMPTY] Field "${label}" kosong`);
            await this.page.mouse.click(50, 50);
        } else if (!totalData) {
            throw new Error(`❌ [FAILED] Tidak ditemukan data "${selected.message}" untuk input "${teks}"`);
        } else {
            await selected.container
                .getByText(teks, { exact: true })
                .first()
                .click();

            console.log(`✅ [SUCCESS] Berhasil memilih ${label}: ${teks}`);
        }
        console.log(`✅ [SUCCESS] Field "${label}" terisi: ${value}`);

        console.log(`✅ [SUCCESS] Dropdown berisi ${totalData} data untuk "${teks}"`);

        for (let i = 0; i < totalData; i++) {
            console.log(`Item ${i + 1}: ${await selected.items.nth(i).innerText()}`);
        }

        await this.page.waitForTimeout(1000);
        await this.runFIlterTest(2);
    }
}