import { expect } from "@playwright/test";

export class formLogin {
    constructor(page) {
        this.page = page;
        this.usernameField = page.locator('#inputEmail');
        this.passwordField = page.locator('#inputPassword');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async usernameInput(username) {
        try {
            await expect(this.usernameField).toBeVisible();
            await this.usernameField.fill(username);

            const value = await this.usernameField.inputValue();
            console.log(`✅ [SUCCESS] Username terisi: ${value}`);

            await expect(this.usernameField).toHaveValue(username);
        } catch (error) {
            console.log('❌ [FAILED] Gagal mengisi Username');
            console.log(`   ↳ Reason: ${error.message}`);
        }
    }

    async passwordInput(password) {
        try {
            await expect(this.passwordField).toBeVisible();
            await this.passwordField.fill(password);

            const value = await this.passwordField.inputValue();
            console.log(`✅ [SUCCESS] Password terisi: ${value}`);

            await expect(this.passwordField).toHaveValue(password);
        } catch (error) {
            console.log('❌ [FAILED] Gagal mengisi Password');
            console.log(`   ↳ Reason: ${error.message}`);
        }
    }

    async buttonLogin() {
        try {
            await expect(this.loginButton).toBeVisible();
            await this.loginButton.click();
            console.log('✅ [SUCCESS] Tombol Login berhasil diklik');
        } catch (error) {
            console.log('❌ [FAILED] Gagal klik tombol Login');
            console.log(`   ↳ Reason: ${error.message}`);
        }
    }
}
