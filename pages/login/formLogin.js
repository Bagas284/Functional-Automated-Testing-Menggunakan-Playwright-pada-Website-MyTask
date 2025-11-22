import { expect } from "@playwright/test";
import { navigateUrl } from "../navigateUrl";

export class formLogin extends navigateUrl{
    constructor(page){
        super(page);
        this.page = page;
        this.usernamefield = page.getByRole('textbox', { name: 'Email or Username' });
        this.passwordField = page.getByRole('textbox', { name: 'Password' });

    }

    async usernameInput(username){
        await expect(this.usernamefield).toBeVisible();
        await this.usernamefield.fill(username);
    }

    async passwordInput(password) {
        await expect(this.passwordField).toBeVisible();
        await this.passwordField.fill(password);
    }

    async buttonLogin(){
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

    async expectMasked() {
        await expect(this.passwordField).toHaveAttribute('type', 'password');
    }

    async expectVisible() {
        await expect(this.passwordField).toHaveAttribute('type', 'text');
    }
}