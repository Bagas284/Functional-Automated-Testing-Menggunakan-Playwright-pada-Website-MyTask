import { expect } from "@playwright/test";
import { button } from "../Button/button";

export class form {
    constructor(page) {
        this.page = page;
        this.tombol = new button(page);
        this.bTambahPilihan = page.getByText('Tambah Pilihan');
        this.popupTambahPilihan = page.getByRole('heading', { name: 'Tambah Pilihan' });
        this.bTambahOpsi = page.getByRole('button', { name: 'Tambah Opsi' });
        this.bBatal = page.getByRole('button', { name: 'Batal' }).first();
        this.bTambah = page.getByRole('button', { name: 'Tambah', exact: true });
    }

    //Field form
    async formInput(textArea, teks, index = null) {
        try{
            let inputForm;

            switch (textArea) {
                case 'Deskripsi User':
                    inputForm = this.page.getByRole('textbox', {
                        name: 'Ex:  Untuk mengatur user'
                    });
                    break;
                
                case 'Deskripsi Kategori':
                    inputForm = this.page.getByRole('textbox', {
                        name: 'Deskripsi *'
                    });
                    break;
                case 'PIN Akun':
                    inputForm = this.page.getByPlaceholder('Masukkan PIN');
                    break;
                default:
                    inputForm = this.page.getByRole('textbox', {
                        name: textArea
                    });
            }

            if (index !== null) {
                inputForm = inputForm.nth(index);
            }

            await expect(inputForm).toBeVisible();

            if(!teks){
                console.log(`⚠️ [EMPTY] Field "${textArea}" kosong`);
                await inputForm.fill(teks)
            } else{
                await inputForm.fill(teks);
                await expect(inputForm).toHaveValue(teks);
            }

            const value = await inputForm.inputValue();
            console.log(`✅ [SUCCESS] Field "${textArea}" terisi: ${value}`);
        } catch(error){
            console.log(`❌ [FAILED] Gagal melakukan mengisi field ${textArea}`);
            console.log(`   ↳ Reason: ${error.message}`);
            throw error;
        }
    }

    //Tambah field daftar input laporan (kategori laporan)
    async tambahInputLaporan(type = []){
        if (type.length === 0){
            throw new Error(`⚠️ [EMPTY] type Input Laporan tidak boleh kosong`);
        }

        for (const types of type){
            try {
                await this.tombol.checkAndClick('Tambah Input Laporan');
                const bTipeInput = this.page.getByRole('button', { name: types });

                await expect(bTipeInput).toBeVisible();
                await bTipeInput.click();
                console.log(`✅ [SUCCESS] Input Laporan "${types}" berhasil ditambahkan`);
            } catch (error) {
                console.log(`❌ [FAILED] Gagal menambahkan Input Laporan "${types}"`);
                console.log(`   ↳ Error: ${error.message}`);
            }
        }
    }

    //Field pilihan tunggal / beberapa (kategori laporan)
    async inputPilihan(teks = [], button){
        const fieldInput = this.page.getByRole('textbox', { name: 'Masukkan pilihan' });
        const countTeks = teks.filter(item => item.trim() !== "").length;
        const x = teks.length;

        try {
            if (countTeks === 0){
                console.log(`⚠️ [EMPTY] Input opsi kosong`);
            } else {
                await expect(this.bTambahPilihan).toBeVisible();
                await this.bTambahPilihan.click();

                await expect(this.popupTambahPilihan).toBeVisible();

                console.log(`✅ [SUCCESS] Berhasil klik tombol "Tambah PIlihan" dan popup muncul`);

                for(let i = 0; i < x; i++){
                    if (i > 0) {
                        await expect(this.bTambahOpsi).toBeVisible();
                        await this.bTambahOpsi.click();
                    }

                    await expect(fieldInput.nth(i)).toBeVisible();
                    await fieldInput.nth(i).fill(teks[i]);
                    await expect(fieldInput.nth(i)).toHaveValue(`${teks[i]}`);
                    const value = await fieldInput.nth(i).inputValue();

                    console.log(`✅ [SUCCESS] Opsi ke-${i + 1} diisi: ${value}`);
                }

                const tombolMap = {
                    'Batal': {
                        locator: this.bBatal,
                        message: 'Batal menambahkan pilihan opsi'
                    },
                    'Tambah': {
                        locator: this.bTambah,
                        message: `Berhasil menambahkan ${countTeks} pilihan opsi`
                    }
                };

                const tombol = tombolMap[button];

                if (!tombol) {
                    throw new Error(`❌ [FAILED] Tombol "${button}" tidak dikenali`);
                }

                await expect(tombol.locator).toBeVisible();
                await tombol.locator.click();
                await expect(this.popupTambahPilihan).toBeHidden();
                await expect(this.page.getByText(`(${countTeks})`, { exact: true })).toBeVisible();
                console.log(`✅ [SUCCESS] ${tombol.message}`);
            }
        } catch (error) {
            console.error(`❌ [FAILED] Tombol "Tambah Pilihan" tidak dapat diklik`);
            throw error;
        }
    }
}