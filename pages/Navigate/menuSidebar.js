import { expect } from "@playwright/test";

export class menuSidebar {
    constructor(page) {
        this.page = page;
    }

    async clickSidebar(teks, index = null) {
        try {
            let sidebar;

            if (index === null) {
                sidebar = this.page.locator(teks);
            } else {
                sidebar = this.page.locator(teks).nth(index);
            }

            await expect(sidebar).toBeVisible();
            await sidebar.click();
            console.log(`✅ [SUCCESS] User diarahkan ke menu: ${teks}`);
        } catch (error) {
            console.log(`❌ [FAILED] Gagal klik sidebar: ${teks}`);
            console.log(`   ↳ Reason: ${error.message}`);
        }
    }
}