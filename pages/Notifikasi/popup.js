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
        //Button
        this.buttonBatal = page.locator('#modal-confirm-delete').getByText('Batal');
        this.buttonHapus = page.locator('button').filter({ hasText: /^Ya$/ });
        this.buttonPindahUser = page.locator('button').getByText('Ya, ganti');
        this.buttonBatalPindahUser = page.locator('#modal-warning').getByText('Batal');
        this.batalPindahUser = page.locator('#modal-transfer-users').getByText('Batal');
        this.confirmPindahUser = page.locator('button').filter({ hasText: 'Pindahkan' });
        this.buttonLanjutkan = page.locator('button').filter({ hasText: 'Lanjutkan' });

        this.notif = new notifikasi(page);
    }

    async popupDelete(button) {
        await expect(this.havePopupConfirmDelete).toBeVisible();
        console.log('✅ [SUCCESS] Muncul popup delete');

        if (button === 'Batal') {
            await this.buttonBatal.click();
            console.log(`✅ [SUCCESS] Klik tombol ${button} dan role tidak terhapus`);
        } else if (button === 'Ya') {
            await this.buttonHapus.click();
            console.log(`✅ [SUCCESS] Klik tombol ${button} dan role terhapus`);
        } else {
            throw new Error(`❌ [FAILED] Button tidak dikenali: ${button}`);
        }
        await expect(this.havePopupConfirmDelete).toBeHidden();
    }

    async popupWarningUser(button){
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
    }

    async popupSelectRole(role, button){
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
    }
}