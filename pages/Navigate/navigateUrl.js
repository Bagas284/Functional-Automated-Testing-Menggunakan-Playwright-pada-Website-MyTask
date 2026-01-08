import { expect } from "@playwright/test";

export class navigateUrl {
    constructor(page){
        this.page = page;
    }

    async navigate(url){
        await this.page.goto(url);
        console.log('User diarahkan ke halaman: ', url);
    }

    async checkUrl(url) {
        await expect(this.page).toHaveURL(url);
        console.log('User berada di halaman: ', url)
    }
}