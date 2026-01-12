import { expect } from "@playwright/test";

export class form {
    constructor(page) {
        this.page = page;
    }

    async formInput(textArea, teks) {
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
        await inputForm.fill(teks);

        if(!teks){
            console.log(`⚠️ [EMPTY] Field "${textArea}" kosong`);
        } else{
            await expect(inputForm).toHaveValue(teks);
            const value = await inputForm.inputValue();
            console.log(`✅ [SUCCESS] Field "${textArea}" terisi: ${value}`);
        }
    }
}