import { expect } from "@playwright/test";

export class form {
    constructor(page) {
        this.page = page;
    }

    async formInput(textArea, teks = null) {
        let inputForm;

        switch (textArea) {
            case 'Deskripsi':
                inputForm = this.page.getByRole('textbox', {
                    name: 'Ex:  Untuk mengatur user'
                });
                break;

            default:
                inputForm = this.page.getByRole('textbox', {
                    name: textArea
                });
        }

        await expect(inputForm).toBeVisible();
        const value = await inputForm.inputValue();

        if(!teks){
            console.log(`⚠️ [EMPTY] Field "${textArea}" kosong`);
        } else{
            await inputForm.fill(teks);
            await expect(inputForm).toHaveValue(teks);
            console.log(`✅ [SUCCESS] Field "${textArea}" terisi: ${value}`);
        }
    }
}