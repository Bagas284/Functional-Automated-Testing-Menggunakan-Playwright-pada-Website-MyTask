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

        const logoutVisible = await this.buttonLogout.isVisible();

        console.log('Muncul dropdown versi dan logout: ', logoutVisible);

        expect(
            logoutVisible,
            'Button logout tidak terlihat'
        ).toBeTruthy();
        
        await this.buttonLogout.click();
    }

    async popup(teks){
        const popupVisible = await this.modalLogout.isVisible();
        console.log('Muncul popup: ', popupVisible);

        expect(
            popupVisible,
            'Popup tidak muncul'
        ).toBeTruthy();

        if (teks == 'Log out'){
            await expect(this.confirmLogout).toBeVisible();
            await this.confirmLogout.click();
            await expect(this.modalLogout).toBeHidden();
            console.log("User berhasil logout");
        } else {
            await expect(this.batalLogout).toBeVisible();
            await this.batalLogout.click();
            await expect(this.modalLogout).toBeHidden();
            console.log("User batal logout");
        }
    }
}