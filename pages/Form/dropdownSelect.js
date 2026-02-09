import { expect } from "@playwright/test";

export class dropdownSelect {
    constructor(page) {
        this.page = page;

        // Tipe Penugasan
        this.dropdownTipePenugasan = page.locator('#dropdownTaskType');
        this.itemsTipePenugasan = this.dropdownTipePenugasan.locator('li');

        // Karyawan
        this.dropdownKaryawan = page.locator('#dropdownEmployee');
        this.itemsKaryawan = this.dropdownKaryawan.locator('li');

        // Role
        this.dropdownRole = page.locator('#role');
    }

    async fieldDropdown(label, teks) {
    try {
        if (!teks) {
            console.log(`⚠️ [EMPTY] Field "${label}" kosong`);
            await this.page.mouse.click(50, 50);
            return;
        }

        switch (label) {
            case 'Role':
                await this.selectOption(this.dropdownRole, teks);
                break;
            case 'Tipe Penugasan':
            case 'Karyawan':
                await this.selectFill(label, teks)
                break;
            default:
                throw new Error(`❌ [FAILED] Field dropdown "${label}" tidak ditemukan`);
        }

    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

    async selectOption(locator, teks) {
        const option = locator.locator(`option:has-text("${teks}")`);

        const count = await option.count();

        if (count === 0) {
            throw new Error(`❌ [FAILED] Option "${teks}" tidak ditemukan di dropdown`);
        }

        const value = await option.getAttribute('value');

        await locator.selectOption({ value });

        await expect(locator).toHaveValue(value);

        console.log(`✅ [SUCCESS] Select "${teks}" berhasil dipilih`);
    }

    async selectFill(label, teks){
        const dropdown = this.page.getByRole('textbox', { name: label });
        await expect(dropdown).toBeVisible();
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

        if (!totalData) {
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
    }
}