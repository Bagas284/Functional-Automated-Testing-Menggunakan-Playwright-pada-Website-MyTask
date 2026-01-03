import { expect } from "@playwright/test";

export class formLogin{
    constructor(page){
        this.page = page;
        this.usernamefield = page.locator('#inputEmail');
        this.passwordField = page.locator('#inputPassword');
    }

    async usernameInput(username) {
        await expect(this.usernamefield).toBeVisible();
        await this.usernamefield.fill(username);

        const value = await this.usernamefield.inputValue();
        console.log('Username field value: ', value);

        await expect(this.usernamefield).toHaveValue(username);
    }

    async passwordInput(password) {
        await expect(this.passwordField).toBeVisible();
        await this.passwordField.fill(password);

        const value = await this.passwordField.inputValue();
        console.log('Password field value: ', value);

        await expect(this.passwordField).toHaveValue(password);
    }

    async buttonLogin(){
        await this.page.getByRole('button', { name: 'Login' }).click();
    }
}