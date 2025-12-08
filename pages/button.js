import { expect } from "@playwright/test";

export class button{
    constructor(page){
        this.page = page;
        this.table = page.locator('table');
    }

    async checkAndClick(teks) {
        const btn = this.page.getByRole('button', { name: teks });
        await expect(btn).toBeVisible();

        const isEnabled = await btn.isEnabled();
        if (isEnabled) {
            await btn.click();
        } else {
            await expect(btn).toBeDisabled();
            console.log('Button tidak aktif');
        }

        await this.page.waitForTimeout(2000);
    }

    async moreOption(teks, button){
        const row = this.page.getByRole('row', { name: teks });

        const btnDropdown = row.locator('#btnDropdownAction');
        await btnDropdown.click();

        const x = this.page.getByRole('paragraph').filter({ hasText: button });

        await x.click();
    }
}