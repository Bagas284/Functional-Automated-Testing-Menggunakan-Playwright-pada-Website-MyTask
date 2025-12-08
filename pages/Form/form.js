import { expect } from "@playwright/test";

export class form{
    constructor(page){
        this.page = page;
    }

    async formInput(textArea, inputTeks){

        if (textArea === 'PIN Akun'){
            const fieldPin = this.page.locator('#pin');
            await expect(fieldPin).toBeVisible();
            await fieldPin.fill(inputTeks);
            await expect(fieldPin).toHaveValue(inputTeks);
        } else {
            const inputForm = this.page.getByRole('textbox', { name: textArea});
            await expect(inputForm).toBeVisible();
            await inputForm.fill(inputTeks);
            await expect(inputForm).toHaveValue(inputTeks);
        }
    }
}