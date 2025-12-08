import { expect } from "@playwright/test";

export class dropdown{
    constructor(page){
        this.page = page;
        this.selectRole = page.locator('#role');
    }

    async selectDropdown(teks){
        await this.selectRole.selectOption({ label: teks});

        await this.page.mouse.click(50, 50);

        const selectedText = await this.selectRole.evaluate(el => el.selectedOptions[0].textContent.trim());
        await expect(selectedText).toBe(teks);
    }
}