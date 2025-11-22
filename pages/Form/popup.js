import { expect } from "@playwright/test";

export class popup{
    constructor(page){
        this.page = page;
        this.havePopupConfirmDelete = page.locator('#modal-confirm-delete');
        this.popupModalWaarning = page.locator('#modal-warning');
        this.popupPidahUser = page.locator('#modal-transfer-users');
        this.popupSuksesPindah = page.locator('#modal-success');

        this.buttonBatal = page.locator('#modal-confirm-delete').getByText('Batal');
        this.buttonHapus = page.locator('button').filter({ hasText: /^Ya$/ });

        this.buttonPindahUser = page.locator('button').getByText('Ya, ganti');
        this.buttonBatalPindahUser = page.locator('#modal-warning').getByText('Batal');

        this.batalPindahUser = page.locator('#modal-transfer-users').getByText('Batal');
        this.confirmPindahUser = page.locator('button').filter({ hasText: 'Pindahkan' });

        this.buttonLanjutkan = page.locator('button').filter({ hasText: 'Lanjutkan' });

    }
    
    async popupConfirmDelete(buttonPopupConfirm){
        //Check Pupup delete
        await expect(this.havePopupConfirmDelete).toBeVisible();

        if (buttonPopupConfirm == 'Batal'){
            //Button batal
            await this.buttonBatal.click();
            //Popup tertutup
            await expect(this.havePopupConfirmDelete).toBeHidden();
        } else {
            //Click button delete pada popup
            await this.buttonHapus.click();
        }
    }

    async popupWarningUser(buttonPindahUser){
        //Check popup warning user
        await expect(this.popupModalWaarning).toBeVisible();

        if(buttonPindahUser == 'Batal'){
            await this.buttonBatalPindahUser.click();
            await expect(this.popupModalWaarning).toBeHidden();
        } else {
            await this.buttonPindahUser.click();
        }
    }

    async popupPindahPengguna(buttonPindahUser, selectRole){
        const dropdown = this.page.locator('#modal-transfer-users select');

        //Check popup
        await expect(this.popupPidahUser).toBeVisible();

        //Select role
        await dropdown.click();
        await dropdown.selectOption({ label: selectRole});
        await this.page.locator('#modal-transfer-users').click(); 

        //Click Pindahkan / batal
        if (buttonPindahUser == 'Batal'){
            await this.batalPindahUser.click();
            await expect(this.popupPidahUser).toBeHidden();
        } else {
            await this.confirmPindahUser.click();
            await expect(this.popupSuksesPindah).toBeVisible();

            await this.buttonLanjutkan.click();
            await expect(this.popupSuksesPindah).toBeHidden();
        }
    }
}