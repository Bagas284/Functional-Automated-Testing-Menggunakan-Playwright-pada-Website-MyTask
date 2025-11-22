import { expect } from "@playwright/test";

export class navigateUrl {
    constructor(page){
        this.page = page;
    }

    async navigate(url){
        await this.page.goto(url);
    }

    async checkUrl(url) {
        await expect(this.page).toHaveURL(url);
    }
}