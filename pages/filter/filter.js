import { expect } from "@playwright/test";

export class filter {
    constructor(page){
        this.page = page;
        //Filter
        this.buttonFilter = page.locator('#btnDropdownFilter');
        this.dropdownFilter = page.locator('#dropdownFilter');
        //Date Range
        this.inputDateRange = page.locator('#inputFilterDateRange');
        //Role
        this.dropdown= page.locator('#dropdownRole');
    }

    async filterOption(){
        await this.buttonFilter.click();
        await expect(this.dropdownFilter).toBeVisible();
    }

    async filterDateRange(tahunStart, bulanStart, tanggalStart, tahunEnd, bulanEnd, tanggalEnd) {
        await this.inputDateRange.click();
        //check muncul kalender
        await expect(this.page.getByRole('grid', { name: 'Calendar wrapper' })).toBeVisible();

        //Pilih tanggal awal
        await this.tanggalAwal(tahunStart, bulanStart, tanggalStart);
        //Pilih tanggal akhir
        await this.tanggalAkhir(tahunEnd, bulanEnd, tanggalEnd);

        await this.page.getByRole('button', { name: 'Confirm' }).click();
    }

    async getCurrentMonthYear() {
        const monthBtn = this.page.getByRole('button', { name: 'Open months overlay' });
        const yearBtn  = this.page.getByRole('button', { name: 'Open years overlay' });

        const bulanSekarang = (await monthBtn.innerText()).trim();
        const tahunSekarang = (await yearBtn.innerText()).trim();

        return { bulanSekarang, tahunSekarang, monthBtn, yearBtn };
    }

    async tanggalAwal(tahun, bulan, tanggal){
        const { bulanSekarang, tahunSekarang, monthBtn, yearBtn } = await this.getCurrentMonthYear();

        const actions = [
            {
                current: bulanSekarang,
                value: bulan,
                btn: monthBtn,
            },
            {
                current: tahunSekarang,
                value: tahun,
                btn: yearBtn,
            }
        ];

        for (const a of actions) {
            if (a.value !== a.current) {
                await a.btn.click();  // buka overlay
                await this.page
                    .getByLabel('Filters')
                    .getByText(a.value, { exact: true })
                    .click();
            }
        }

        // Select Tanggal
        await this.page
            .getByLabel('Filters')
            .getByText(tanggal, { exact: true })
            .first()
            .click();
    }

    async tanggalAkhir(tahun, bulan, tanggal){
        const { bulanSekarang, tahunSekarang, monthBtn, yearBtn } = await this.getCurrentMonthYear();

        const actions = [
            {
                current: bulanSekarang,
                value: bulan,
                btn: monthBtn,
            },
            {
                current: tahunSekarang,
                value: tahun,
                btn: yearBtn,
            }
        ];

        for (const a of actions) {
            if (a.value !== a.current) {
                await a.btn.click();
                await this.page
                    .getByLabel('Filters')
                    .getByText(a.value, { exact: true })
                    .click();
            }
        }
        // Select Tanggal
        await this.page
            .getByLabel('Filters')
            .getByText(tanggal, { exact: true })
            .first()
            .click();
    }

    async selectRole(teks){
        const fieldRole =  await this.page.getByRole('textbox', { name: 'Role' });

        await fieldRole.fill(teks);

        await expect(this.dropdown).toBeVisible();
        await this.dropdown.getByText(teks, { exact: true }).first().click();
        await expect(fieldRole).toHaveValue(teks);
    }
}