import { expect } from "@playwright/test";

export class radioButton {
    constructor(page){
        this.page = page;
        this.fieldRole = page.locator('#role');
        this.fieldPassword = page.locator('#password');
        this.fieldPin = page.locator('#pin');
    }

    async selectRadioButton(teks){
        const pilihan = await this.page.getByRole('radio', { name: teks });
        await pilihan.check();
        await expect(pilihan).toBeChecked();

        await this.checkField(teks);
    }

    async checkField(teks){
        if(teks == 'Web User'){
            console.log('Terdapat select role dan input password');
            await expect(this.fieldRole).toBeVisible();
            await expect(this.fieldPassword).toBeVisible();
        } else {
            console.log('Terdapat input pin');
            await expect(this.fieldPin).toBeVisible();
        }
    }
}