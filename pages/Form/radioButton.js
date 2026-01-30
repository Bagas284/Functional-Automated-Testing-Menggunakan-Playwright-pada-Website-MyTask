import { expect } from "@playwright/test";

export class radioButton {
    constructor(page){
        this.page = page;
    }

    async selectRadioButton(teks){
        try{
            const pilihan = await this.page.getByRole('radio', { name: teks });
            await pilihan.check();
            await expect(pilihan).toBeChecked();
            console.error(`✅ [SUCCESS] Berhasil memilih radio button: ${teks}`);
        } catch(error){
            console.error(`❌ [FAILED] Gagal memilih radio button: ${teks}`);
            throw error;
        }
        
    }
}