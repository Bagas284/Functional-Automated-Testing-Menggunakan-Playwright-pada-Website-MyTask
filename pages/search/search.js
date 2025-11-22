import { expect } from "@playwright/test";
import { checkData } from "../check data/checkData";

export class search extends checkData{
    constructor(page, columnIndex = 0){
        super(page, columnIndex);
        this.page = page;
        this.searchBox = page.getByRole('textbox', { name: 'Search' });
    }

    async search(teks){
        await expect(this.searchBox).toBeVisible();
        
        await this.searchBox.fill(teks);
        await expect(this.searchBox).toHaveValue(teks);

        await this.page.waitForTimeout(2000);
    }
}