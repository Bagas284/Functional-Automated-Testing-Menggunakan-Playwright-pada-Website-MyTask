import { expect } from "@playwright/test";

export class navigateUrl {
    constructor(page) {
        this.page = page;
    }

    async navigate(url) {
        try {
            await this.page.goto(url, { waitUntil: 'domcontentloaded' });
            console.log(`✅ [SUCCESS] User diarahkan ke halaman: ${url}`);
        } catch (error) {
            console.log(`❌ [FAILED] Gagal navigasi ke halaman: ${url}`);
            console.log(`   ↳ Reason: ${error.message}`);
        }
    }

    async checkUrl(url) {
        try {
            await expect(this.page).toHaveURL(url, { timeout: 5000 });
            console.log(`✅ [SUCCESS] User berada di halaman: ${url}`);
        } catch (error) {
            console.log(`❌ [FAILED] URL tidak sesuai: ${url}`);
            console.log(`   ↳ Reason: ${error.message}`);
        }
    }
}