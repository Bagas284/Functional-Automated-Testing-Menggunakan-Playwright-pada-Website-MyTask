import { expect } from "@playwright/test";

export class messageError {
    constructor(page){
        this.page = page;
        this.nameError = page.getByText('Nama Kategori harus diisi');
        this.deskripsiError = page.getByText('Deskripsi harus diisi');

        this.nameField = page.getByRole('textbox', { name: 'Nama Kategori' });
        this.deskripsiField = page.getByRole('textbox', { name: 'Deskripsi *' });
    }

    async textError() {
        const nameValue = (await this.nameField.inputValue()).trim();
        const deskripsiValue = (await this.deskripsiField.inputValue()).trim();

        if (nameValue === '') {
            await expect(this.nameError).toBeVisible();
            console.log('✅ [SUCCESS] Error Nama Kategori muncul');
        } else {
            await expect(this.nameError).toBeHidden();
        }

        if (deskripsiValue === '') {
            await expect(this.deskripsiError).toBeVisible();
            console.log('✅ [SUCCESS] Error Deskripsi muncul');
        } else {
            await expect(this.deskripsiError).toBeHidden();
        }
    }
}