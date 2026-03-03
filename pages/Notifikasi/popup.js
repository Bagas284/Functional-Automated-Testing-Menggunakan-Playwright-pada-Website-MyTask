import { expect } from "@playwright/test";
import { notifikasi } from "./notifikasi";

export class popup {
    constructor(page){
        this.page = page;
        //Popup
        this.havePopupConfirmDelete = page.locator('#modal-confirm-delete');
        this.popupWarning = page.locator('#modal-warning');
        this.popupPidahUser = page.locator('#modal-transfer-users');
        this.popupSuksesPindah = page.locator('#modal-success');
        this.popupInputLaporan = page.getByRole('heading', { name: 'Hapus Input Laporan' });
        this.popupInputPassword = page.getByPlaceholder('Input Password');
        //Button Role
        this.buttonBatal = page.locator('#modal-confirm-delete').getByText('Batal');
        this.buttonHapus = page.locator('button').filter({ hasText: /^Ya$/ });

        this.buttonPindahUser = page.locator('button').getByText('Ya, ganti');
        this.buttonBatalPindahUser = page.locator('#modal-warning').getByText('Batal');

        this.batalPindahUser = page.locator('#modal-transfer-users').getByText('Batal');
        this.confirmPindahUser = page.locator('button').filter({ hasText: 'Pindahkan' });

        this.buttonLanjutkan = page.locator('button').filter({ hasText: 'Lanjutkan' });
        //Button Tipe Penugasan
        this.bHapusTipeTugas = page.locator('button').filter({ hasText: 'Konfirmasi' });
        this.bBatalHapusTipeTugas = page.locator('#modal-confirm-delete button').filter({ hasText: 'Tidak, Kembali' });

        //Button Input Laporan
        this.bBatalHapusInput = page.getByRole('button', { name: 'Cancel' });
        this.bHapusInput = page.getByRole('button', { name: 'Delete' });

        //Button Pengguna
        this.bKonfirmasiHapus = page.locator('button').filter({ hasText: 'Hapus'});
        this.bBatalKonfirmasiHapus = page.locator('button').filter({ hasText: 'Batal' });

        this.notif = new notifikasi(page);
    }

    async popupDelete(button) {
        try {
            await expect(this.havePopupConfirmDelete).toBeVisible();
            console.log('✅ [SUCCESS] Muncul popup delete');

            const actions = {
                //Role
                'Batal': {
                    locator: this.buttonBatal,
                    message: 'role tidak terhapus',
                },
                'Ya': {
                    locator: this.buttonHapus,
                    message: 'terhapus',
                },
                //Tipe Tugas
                'Konfirmasi': {
                    locator: this.bHapusTipeTugas,
                    message: 'tipe tugas terhapus',
                },
                'Tidak, Kembali': {
                    locator: this.bBatalHapusTipeTugas,
                    message: 'batal hapus',
                }
            };

            const action = actions[button];
            if (!action) {
                throw new Error(`❌ [FAILED] Button tidak dikenali: ${button}`);
            }

            await action.locator.click();
            console.log(`✅ [SUCCESS] Klik tombol "${button}" dan ${action.message}`);

            await expect(this.havePopupConfirmDelete).toBeHidden();
        } catch (error) {
            console.log(`❌ [FAILED] Gagal memproses delete role`);
            console.log(`   ↳ Reason: ${error.message}`);
            throw error
        }
    }

    async popupWarningUser(button){
        try {
            await expect(this.popupWarning).toBeVisible();
            console.log('✅ [SUCCESS] Muncul popup "Role Masih Memiliki Pengguna"');
            await this.notif.notificationCheck();

            if(button === 'Batal'){
                await this.buttonBatalPindahUser.click();
                console.log(`✅ [SUCCESS] Klik tombol "${button}" dan role tidak terhapus`);
            } else if (button === 'Ya, ganti'){
                await this.buttonPindahUser.click();
                await expect(this.popupPidahUser).toBeVisible();
                console.log(`✅ [SUCCESS] Klik tombol "${button}" dan muncul popup "Daftar Role"`);
            } else {
                throw new Error(`❌ [FAILED] Button tidak dikenali: ${button}`);
            }
            await expect(this.popupWarning).toBeHidden();
        } catch (error) {
            console.log(`❌ [FAILED] Gagal memproses delete role`);
            console.log(`   ↳ Reason: ${error.message}`);
            throw error
        }  
    }

    async popupSelectRole(role, button){
        try {
            const dropdown = this.page.locator('#modal-transfer-users select');
            const exists = await dropdown.locator(`option:has-text("${role}")`).count();

            if (!exists) {
                throw new Error(`❌ [FAILED] Role "${role}" tidak tersedia`);
            } else {
                await dropdown.click();
                await dropdown.selectOption({ label: role});
                await this.page.locator('#modal-transfer-users').click();
                const roleName = await dropdown.evaluate(el => el.selectedOptions[0].text);
                console.log(`✅ [SUCCESS] Berhasil memilih role: ${roleName}`);

                if (button === "Batal"){
                    await this.batalPindahUser.click();
                    console.log(`✅ [SUCCESS] Klik tombol "${button}" dan batal memindahkan pengguna`);
                } else if(button === "Pindahkan"){
                    // Klik tombol konfirmasi pindah
                    await this.confirmPindahUser.click();
                    console.log(`✅ [SUCCESS] Klik tombol "${button}"`);
                    await this.notif.notificationCheck();

                    // Cek popup sukses muncul
                    await expect(this.popupSuksesPindah).toBeVisible();
                    console.log(`✅ [SUCCESS] Popup sukses pindah user muncul`);
                    console.log(`✅ [SUCCESS] User berhasil dipindahkan ke role ${role}`);
                    console.log(`✅ [SUCCESS] Role berhasil dihapus`);
                    // Klik lanjutkan
                    await this.buttonLanjutkan.click();
                    await expect(this.popupSuksesPindah).toBeHidden();
                } else {
                    throw new Error(`❌ [FAILED] Button tidak dikenali: ${button}`);
                }
                await expect(this.popupPidahUser).toBeHidden();
            }
        } catch (error) {
            console.log(`❌ [FAILED] Gagal memproses pindah role pengguna`);
            console.log(`   ↳ Reason: ${error.message}`);
            throw error
        }
    }

    async popupDeleteInput(button){
        await expect(this.popupInputLaporan).toBeVisible();
        console.log('✅ [SUCCESS] Muncul popup delete input laporan');

        const actions = {
            'Cancel': {
                locator: this.bBatalHapusInput,
                message: 'input laporan tidak terhapus',
            },
            'Delete': {
                locator: this.bHapusInput,
                message: 'input laporan terhapus',
            },
        };

        const action = actions[button];
        if (!action) {
            throw new Error(`❌ [FAILED] Button tidak dikenali: ${button}`);
        }

        await action.locator.click();
        console.log(`✅ [SUCCESS] Klik tombol "${button}" dan ${action.message}`);

        await expect(this.popupInputLaporan).toBeHidden();
    }

    async popupConfirmDelete(password, button){
        try{
            await expect(this.popupInputPassword).toBeVisible();
            await expect(this.bKonfirmasiHapus).toBeVisible();
            await expect(this.bBatalKonfirmasiHapus).toBeVisible();
            console.log(`✅ [SUCCESS] Popup konfirmasi penghapusan muncul`);

            await this.popupInputPassword.fill(password);
            const value = await this.popupInputPassword.inputValue();

            if(!value){
                await expect(this.bKonfirmasiHapus).toBeDisabled();
                console.log(`⚠️ [EMPTY] Password kosong dan tombol hapus tidak dapat diklik`);
                return;
            } 

            await expect(this.popupInputPassword).toHaveValue(password);
            console.log(`✅ [SUCCESS] Field Password terisi: ${value}`);

            if(button === 'Batal'){
                await this.bBatalKonfirmasiHapus.click();
                await expect(this.popupInputPassword).toBeHidden();
                console.log(`✅ [SUCCESS] Berhasil klik ${button} dan pengguna batal dihapus`);
                return;
            }
            await this.bKonfirmasiHapus.click();

            const sukses = await this.notif.notificationCheck();

            if(sukses){
                await expect(this.popupInputPassword).toBeHidden();
                console.log(`✅ [SUCCESS] Berhasil klik ${button} dan pengguna dihapus`);
            } else{
                await expect(this.popupInputPassword).toBeVisible();
            }
        } catch(error){
            console.log(`❌ [FAILED] ${error.message}`);
        }
    }
}