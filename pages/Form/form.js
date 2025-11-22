import { expect } from "@playwright/test";

export class form{
    constructor(page){
        this.page = page;
    }

    async formInput(textArea, inputTeks){
        const inputForm = this.page.getByRole('textbox', { name: textArea});
        await expect(inputForm).toBeVisible();
        await inputForm.fill(inputTeks);
        await expect(inputForm).toHaveValue(inputTeks);
    }
}