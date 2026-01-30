import { expect } from "@playwright/test";

export class dropdownSelect{
    constructor(page){
        this.page = page;
        //Tipe Penugasan
        this.dropdownTipePenugasan = page.locator('#dropdownTaskType');
        this.itemsTipePenugasan = this.dropdownTipePenugasan.locator('li');
        //Karyawan
        this.dropdownKaryawan = page.locator('#dropdownEmployee');
        this.itemsKaryawan = this.dropdownKaryawan.locator('li');
    }

    async fieldDropdown(label, teks) {
        const dropdown = this.page.getByRole('textbox', { name: label });
        await expect(dropdown).toBeVisible();
        await this.page.waitForTimeout(700);
        await dropdown.fill(teks);

        const dropdownMap = {
            'Tipe Penugasan': {
                container: this.dropdownTipePenugasan,
                items: this.itemsTipePenugasan,
                message: 'Tipe Penugasan'
            },
            'Karyawan': {
                container: this.dropdownKaryawan,
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
            
            await this.page.mouse.click(50, 50);

            console.log(`✅ [SUCCESS] Berhasil memilih ${label}: ${teks}`);
        }
        console.log(`✅ [SUCCESS] Field "${label}" terisi: ${value}`);

        console.log(`✅ [SUCCESS] Dropdown berisi ${totalData} data untuk "${teks}"`);

        for (let i = 0; i < totalData; i++) {
            console.log(`Item ${i + 1}: ${await selected.items.nth(i).innerText()}`);
        }
    }
}