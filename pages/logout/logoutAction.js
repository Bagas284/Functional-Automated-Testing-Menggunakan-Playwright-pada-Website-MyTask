import { expect } from "@playwright/test";

export class logoutAction{
    constructor(page){
        this.page = page;
        this.userProfile = page.locator('#dropdownActivator');
        this.modalLogout = page.locator('#modal-logout');
        this.buttonLogout = page.locator('div').filter({ hasText: /^Log out$/ });
        this.confirmLogout = page.locator('button').filter({ hasText: 'Log Out' });
        this.batalLogout = page.locator('button').filter({ hasText: 'Tidak, Kembali' });

    }

    async clickLogout(){
        await expect(this.userProfile).toBeVisible();
        await this.userProfile.click();

        await expect(this.buttonLogout).toBeVisible();
        await this.buttonLogout.click();
    }

    async popup(teks){
        await expect(this.modalLogout).toBeVisible();
        if (teks == 'Log out'){
            await expect(this.confirmLogout).toBeVisible();
            await this.confirmLogout.click();
            await expect(this.modalLogout).toBeHidden();
        } else {
            await expect(this.batalLogout).toBeVisible();
            await this.batalLogout.click();
            await expect(this.modalLogout).toBeHidden();
        }
    }
}