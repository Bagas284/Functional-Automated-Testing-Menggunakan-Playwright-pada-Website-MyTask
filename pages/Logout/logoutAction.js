import { expect } from "@playwright/test";

export class logoutAction {
    constructor(page) {
        this.page = page;
        this.userProfile = page.locator('#dropdownActivator');
        this.modalLogout = page.locator('#modal-logout');
        this.buttonLogout = page.locator('div').filter({ hasText: /^Log out$/ });
        this.confirmLogout = page.locator('button').filter({ hasText: 'Log Out' });
        this.batalLogout = page.locator('button').filter({ hasText: 'Tidak, Kembali' });
    }

    async clickLogout() {
        try {
            await expect(this.userProfile).toBeVisible();
            await this.userProfile.click();

            const logoutVisible = await this.buttonLogout.isVisible();
            console.log('Dropdown logout muncul:', logoutVisible);

            expect(
                logoutVisible,
                'Button logout tidak terlihat'
            ).toBeTruthy();

            await this.buttonLogout.click();
            console.log('✅ [SUCCESS] Klik tombol Logout');

        } catch (error) {
            console.log('❌ [FAILED] Gagal membuka menu Logout');
            console.log(`   ↳ Reason: ${error.message}`);
        }
    }

    async popup(teks) {
        try {
            const popupVisible = await this.modalLogout.isVisible();
            console.log('Popup logout muncul:', popupVisible);

            expect(
                popupVisible,
                'Popup logout tidak muncul'
            ).toBeTruthy();

            if (teks === 'Log out') {
                await expect(this.confirmLogout).toBeVisible();
                await this.confirmLogout.click();
                await expect(this.modalLogout).toBeHidden();
                console.log('✅ [SUCCESS] User berhasil logout');
            } else {
                await expect(this.batalLogout).toBeVisible();
                await this.batalLogout.click();
                await expect(this.modalLogout).toBeHidden();
                console.log('⚠️ [CANCELLED] User batal logout');
            }

        } catch (error) {
            console.log('❌ [FAILED] Gagal memproses popup Logout');
            console.log(`   ↳ Reason: ${error.message}`);
        }
    }
}