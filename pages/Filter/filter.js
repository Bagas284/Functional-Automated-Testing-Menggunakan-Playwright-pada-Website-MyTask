import { expect } from "@playwright/test";
import { error } from "node:console";

export class filter {
    constructor(page) {
        this.page = page;
        this.inputDateRange = page.locator('#inputFilterDateRange');
        this.inputStartDate = page.locator('#inputFilterStartDate');
        this.inputEndDate = page.locator('#inputFilterEndDate');
        //Filter
        this.buttonFilter = page.locator('#btnDropdownFilter');
        this.dropdownFilter = page.locator('#dropdownFilter');
        //Laporan Aktifitas
        this.containerLaporanAktifitas = page.locator('#dropdownCategory');
        this.itemsLaporanAktifitas = this.containerLaporanAktifitas.locator('li');
        //Karyawan
        this.containerKaryawan = page.locator('#dropdownEmployee');
        this.itemsKaryawan = this.containerKaryawan.locator('li');
        //Role
        this.containerRole = page.locator('#dropdownRole');
        this.itemsRole = this.containerRole.locator('li');
        //Status
        this.todo = page.locator('#cboxFilterTodo');
        this.doing = page.locator('#cboxFilterDoing');
        this.done = page.locator('#cboxFilterDone');
        this.cancel = page.locator('#cboxFilterCancel');
    }

    //Buka menu filter
    async filterOption(){
        try {
            await this.buttonFilter.click();
            await expect(this.dropdownFilter).toBeVisible();
            console.log('✅ [SUCCESS] Muncul menu filter');
        } catch (error) {
            console.log(`❌ [FAILED] Gagal memproses filter`);
            console.log(`   ↳ Reason: ${error.message}`);
            throw error
        }
    }

    //FIlter dropdown
    async filterDropdown(label, teks) {
        try {
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
                },
                'Role': {
                    container: this.containerRole,
                    items: this.itemsRole,
                    message: 'Role'
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
        } catch (error) {
            console.log(`❌ [FAILED] Gagal memproses filter ${label}`);
            console.log(`   ↳ Reason: ${error.message}`);
            throw error
        }
    }

    //Filter status (daftar tugas)
    async filterStatus(label = []){
        for (const labels of label){
            switch(labels){
                case 'Dalam Antrian':
                    await expect(this.todo).toBeVisible();
                    await this.todo.click();
                    await expect(this.todo).toBeChecked();
                    console.log(`✅ [SUCCESS] Status "${labels}" berhasil dipilih`);
                break;
                case 'Dikerjakan':
                    await expect(this.doing).toBeVisible();
                    await this.doing.click();
                    await expect(this.doing).toBeChecked();
                    console.log(`✅ [SUCCESS] Status "${labels}" berhasil dipilih`);
                break;
                case 'Selesai':
                    await expect(this.done).toBeVisible();
                    await this.done.click();
                    await expect(this.done).toBeChecked();
                    console.log(`✅ [SUCCESS] Status "${labels}" berhasil dipilih`);
                break;
                case 'Batal':
                    await expect(this.cancel).toBeVisible();
                    await this.cancel.click();
                    await expect(this.cancel).toBeChecked();
                    console.log(`✅ [SUCCESS] Status "${labels}" berhasil dipilih`);
                break;
                default:
                    throw new error(`❌ [FAILED] Status ${labels} tidak dikenali`);
            }
        }
    }

    //Filter date range
    async filterDateRange(
        mode,
        tahunStart,
        bulanStart,
        tanggalStart,
        tahunEnd = null,
        bulanEnd = null,
        tanggalEnd = null
    ) {
        try {
            if (mode === 'range') {
                await this.inputDateRange.click();
            } else if (mode === 'start') {
                await this.inputStartDate.click();
            } else if (mode === 'end') {
                await this.inputEndDate.click();
            } else {
                throw new Error(`Mode tidak valid: ${mode}`);
            }

            await this.page.waitForTimeout(500);
            await expect(
                this.page.getByRole('grid', { name: 'Calendar wrapper' })
            ).toBeVisible();
            
            await this.page.evaluate(() => window.scrollBy(0, 500));

            console.log(`✅ [SUCCESS] Kalender terbuka (${mode})`);

            // 2. Logika pemilihan tanggal
            if (mode === 'range') {
                await this.tanggalAwal(tahunStart, bulanStart, tanggalStart);
                await this.tanggalAkhir(tahunEnd, bulanEnd, tanggalEnd);

                await this.page.getByRole('button', { name: 'Confirm' }).click();

                console.log(
                    `✅ [SUCCESS] Filter range: ${tanggalStart} ${bulanStart} ${tahunStart} → ${tanggalEnd} ${bulanEnd} ${tahunEnd}`
                );
            }

            if (mode === 'start') {
                await this.tanggalAwal(tahunStart, bulanStart, tanggalStart);
                await this.page.getByRole('button', { name: 'Confirm' }).click();
            }

            if (mode === 'end') {
                await this.tanggalAkhir(tahunStart, bulanStart, tanggalStart);
                await this.page.getByRole('button', { name: 'Confirm' }).click();
            }
        } catch (error) {
            console.error('❌ [FAILED] Filter tanggal gagal:', error.message);
            throw error;
        }
    }

    async getCurrentMonthYear() {
        const monthBtn = this.page.getByRole('button', { name: 'Open months overlay' });
        const yearBtn  = this.page.getByRole('button', { name: 'Open years overlay' });

        const bulanSekarang = (await monthBtn.innerText()).trim();
        const tahunSekarang = (await yearBtn.innerText()).trim();

        return { bulanSekarang, tahunSekarang, monthBtn, yearBtn };
    }

    async tanggalAwal(tahun, bulan, tanggal) {
        try {
            const { bulanSekarang, tahunSekarang, monthBtn, yearBtn } = await this.getCurrentMonthYear();

            const actions = [
                { current: tahunSekarang, value: tahun, btn: yearBtn },
                { current: bulanSekarang, value: bulan, btn: monthBtn },
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

            await this.page
                .getByLabel('Filters')
                .getByText(tanggal, { exact: true })
                .first()
                .click();

            console.log(`✅ [SUCCESS] Tanggal awal dipilih: ${tanggal} ${bulan} ${tahun}`);
        } catch (error) {
            console.error(
                `❌ [FAILED] Gagal memilih tanggal awal: ${tanggal} ${bulan} ${tahun}`,
                error.message
            );
            throw error;
        }
    }

    async tanggalAkhir(tahun, bulan, tanggal) {
        try {
            const { bulanSekarang, tahunSekarang, monthBtn, yearBtn } =
                await this.getCurrentMonthYear();

            const actions = [
                { current: tahunSekarang, value: tahun, btn: yearBtn },
                { current: bulanSekarang, value: bulan, btn: monthBtn },
            ];

            for (const a of actions) {
                if (a.value !== a.current) {
                    await a.btn.click();
                    await this.page
                        .getByLabel('Filters')
                        .getByText(a.value, { exact: true })
                        .click();

                    console.log(`🔁 [INFO] Ganti ke ${a.value}`);
                }
            }

            await this.page
                .getByLabel('Filters')
                .getByText(tanggal, { exact: true })
                .first()
                .click();

            console.log(
                `✅ [SUCCESS] Tanggal akhir dipilih: ${tanggal} ${bulan} ${tahun}`
            );
        } catch (error) {
            console.error(
                `❌ [FAILED] Gagal memilih tanggal akhir: ${tanggal} ${bulan} ${tahun}`,
                error.message
            );
            throw error;
        }
    }
}