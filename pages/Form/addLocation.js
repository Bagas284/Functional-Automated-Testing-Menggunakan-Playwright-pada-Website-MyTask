import { expect } from "@playwright/test";
import { notifikasi } from "../Notifikasi/notifikasi";

export class addLocation{
    constructor(page){
        this.page = page;
        //Lokasi Awal
        this.bLokasiAwal = page.getByRole('button', { name: 'Tambah Lokasi Awal' });
        this.menuLokasiAwal = page.getByRole('heading', { name: 'Lokasi Awal' });
        this.fieldAlamatAwal = page.locator('#nameLocation');

        //Lokasi Tujuan
        this.bLokasiTujuan = page.getByRole('button', { name: 'Tambah Lokasi Tujuan' });
        this.menuLokasiTujuan = page.getByRole('heading', { name: 'Lokasi Tujuan' });
        this.fieldNamaTujuan = page.locator('#location');

        this.fieldAlamatLengkap = page.locator('#triggerDropdownTujuan');
        this.itemsALamatLengkap = page.locator('#dropdownTujuan li');
        this.notif = new notifikasi(page);
    }

    async lokasiAwal(alamat, button){
        try {
            if (!alamat) {
                await expect(this.bLokasiAwal).toBeVisible();
                await this.bLokasiAwal.click();

                await expect(this.menuLokasiAwal).toBeVisible();
                console.log(`✅ [SUCCESS] Tombol Tambah Lokasi Awal berhasil diklik dan muncul menu tambah lokasi awal`);
                const btnSimpan = this.page.getByRole('button', { name: 'Simpan' });

                await expect(btnSimpan).toBeDisabled();
                await expect(this.menuLokasiAwal).toBeVisible();
                console.log(`⚠️ [EMPTY] Alamat kosong, menu Tambah Lokasi Awal tetap dibuka`);
                return;
            }

            //Klik button tambah lokasi awal
            await expect(this.bLokasiAwal).toBeVisible();
            await this.bLokasiAwal.click();
            await expect(this.menuLokasiAwal).toBeVisible();
            console.log(`✅ [SUCCESS] Tombol Tambah Lokasi Awal berhasil diklik dan muncul menu tambah lokasi awal`);

            //Isi field alamat awal
            await expect(this.fieldAlamatAwal).toBeVisible();
            await this.fieldAlamatAwal.fill(alamat);
            await expect(this.fieldAlamatAwal).toHaveValue(alamat);
            const valueTempatAwal = await this.fieldAlamatAwal.inputValue();
            console.log(`✅ [SUCCESS] Field "Nama Tempat Awal Pickup" terisi: ${valueTempatAwal}`);

            //Isi alamat tujuan
            await expect(this.fieldAlamatLengkap).toBeVisible();
            await this.fieldAlamatLengkap.type(alamat, { delay: 200 });
            await this.page.waitForTimeout(1000);
            const totalData = await this.itemsALamatLengkap.count();

            if(!totalData){
                throw new Error(`⚠️ [EMPTY] Tidak ditemukan data untuk input "${alamat}"`);
            }

            for (let i = 0; i < totalData; i++) {
                await expect(this.itemsALamatLengkap.nth(i)).toBeVisible();
                console.log(`Item ${i + 1}: ${await this.itemsALamatLengkap.nth(i).innerText()}`);
            }

            await this.itemsALamatLengkap.first().click();
            const valueAlamatLengkap = await this.fieldAlamatLengkap.inputValue();
            console.log(`✅ [SUCCESS] Field "Alamat Lengkap" terisi: ${valueAlamatLengkap}`);

            const actions = {
                'Simpan': {
                    tombol: await this.page.locator('#saveButton'),
                    message: `✅ [SUCCESS] Lokasi awal berhasil ditambahkan: ${alamat} dan ${valueAlamatLengkap}`
                },
                'Batal': {
                    tombol: await this.page.locator('#hideLokasiAsal'),
                    message: `✅ [SUCCESS] Lokasi awal batal ditambahkan`
                }
            };

            const selected = actions[button];

            if (!selected) {
                throw new Error(`❌ [FAILED] Tombol "${button}" tidak valid`);
            }

            await selected.tombol.click();
            console.log(`${selected.message}`);

            //Cek
            await this.notif.notificationCheck();
        } catch(error){
            console.log(`❌ [FAILED] ${error.message}`);
            throw error;
        }
    }

    async lokasiTujuan(alamat = [], button){
        try{
            if (alamat.length === 0) {
                await expect(this.bLokasiTujuan).toBeVisible();
                await this.bLokasiTujuan.click();

                await expect(this.menuLokasiTujuan).toBeVisible();
                console.log(`✅ [SUCCESS] Tombol Tambah Lokasi Tujuan berhasil diklik dan muncul menu tambah lokasi tujuan`);
                const btnSimpan = this.page.getByRole('button', { name: 'Simpan' });

                await expect(btnSimpan).toBeDisabled();
                await expect(this.menuLokasiTujuan).toBeVisible();
                console.log(`⚠️ [EMPTY] Alamat kosong, menu Tambah Lokasi Tujuan tetap dibuka`);
                return;
            }

            for(const daftarAlamat of alamat){
                //Klik button tambah lokasi tujuan
                await expect(this.bLokasiTujuan).toBeVisible();
                await this.bLokasiTujuan.click();
                await expect(this.menuLokasiTujuan).toBeVisible();
                console.log(`✅ [SUCCESS] Tombol Tambah Lokasi Tujuan berhasil diklik dan muncul menu tambah lokasi tujuan`);

                //Isi field alamat tujuan
                await expect(this.fieldNamaTujuan).toBeVisible();
                await this.fieldNamaTujuan.fill(daftarAlamat);
                await expect(this.fieldNamaTujuan).toHaveValue(daftarAlamat);
                const valueNamaTujuan = await this.fieldNamaTujuan.inputValue();
                console.log(`✅ [SUCCESS] Field "Nama Tujuan" terisi: ${valueNamaTujuan}`);

                //Isi alamat tujuan
                await expect(this.fieldAlamatLengkap).toBeVisible();
                await this.fieldAlamatLengkap.type(daftarAlamat, { delay: 250 });
                await this.page.waitForTimeout(1000);
                const totalData = await this.itemsALamatLengkap.count();

                if(!totalData){
                    throw new Error(`⚠️ [EMPTY] Tidak ditemukan data untuk input "${daftarAlamat}"`);
                }

                for (let i = 0; i < totalData; i++) {
                    await expect(this.itemsALamatLengkap.nth(i)).toBeVisible();
                    console.log(`Item ${i + 1}: ${await this.itemsALamatLengkap.nth(i).innerText()}`);
                }

                await this.itemsALamatLengkap.first().click();
                const valueAlamatLengkap = await this.fieldAlamatLengkap.inputValue();
                console.log(`✅ [SUCCESS] Field "Alamat Lengkap" terisi: ${valueAlamatLengkap}`);

                const actions = {
                    'Simpan': {
                        tombol: await this.page.getByRole('button', { name: 'Simpan' }),
                        message: `✅ [SUCCESS] Lokasi Tujuan berhasil ditambahkan: ${daftarAlamat} dan ${valueAlamatLengkap}`
                    },
                    'Batal': {
                        tombol: await this.page.locator('#hideDestination'),
                        message: `✅ [SUCCESS] Lokasi tujuan batal ditambahkan`
                    }
                };

                const selected = actions[button];

                if (!selected) {
                    throw new Error(`❌ [FAILED] Tombol "${button}" tidak valid`);
                }

                await selected.tombol.click();
                console.log(`${selected.message}`);

                //Cek
                await this.notif.notificationCheck();
            }
        } catch(error){
            console.log(`❌ [FAILED] ${error.message}`);
            throw error;
        }
    }

    async hapusLokasiTujuan(indek, button){
        try{
            const bHapusTujuan = this.page.locator('div.flex.justify-between label:nth-child(2) svg:nth-child(2)');
            await expect(bHapusTujuan.nth(indek)).toBeVisible();
            await bHapusTujuan.nth(indek).click();

            const popupHapus = this.page.getByText('Konfirmasi Hapus');
            await expect(popupHapus).toBeVisible();

            const actions = {
                'Konfirmasi': {
                    tombol: await this.page.locator('button').filter({ hasText: 'Konfirmasi' }),
                    message: `✅ [SUCCESS] Tujuan ke-${indek+1} berhasil dihapus`
                },
                'Tidak, Kembali': {
                    tombol: await this.page.locator('#modal-confirm-delete button').filter({ hasText: 'Tidak, Kembali' }),
                    message: `✅ [SUCCESS] Tujuan ke-${indek+1} batal dihapus`
                }
            };

            const selected = actions[button];

            if (!selected) {
                throw new Error(`❌ [FAILED] Tombol "${button}" tidak valid`);
            }

            await selected.tombol.click();
            console.log(`${selected.message}`);
            await expect(popupHapus).toBeHidden();
        } catch(error){
            console.log(`❌ [FAILED] Indek: ${indek }${error.message}`);
            throw error;
        }
        
    }
}