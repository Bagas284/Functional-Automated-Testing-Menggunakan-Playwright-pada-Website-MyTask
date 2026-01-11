import { expect } from "@playwright/test";

export class menuSidebar {
    constructor(page) {
        this.page = page;
    }

    async clickSidebar(teks) {
        try {
            const sidebar = this.page.locator(teks);

            await expect(sidebar).toBeVisible();
            await sidebar.click();

            console.log(`✅ [SUCCESS] User diarahkan ke menu: ${teks}`);
        } catch (error) {
            console.log(`❌ [FAILED] Gagal klik sidebar: ${teks}`);
            console.log(`   ↳ Reason: ${error.message}`);
        }
    }
}