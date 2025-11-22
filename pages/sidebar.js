export class sidebar {
    constructor (page){
        this.page = page;
    }

    async clickSidebar(teks) {
        await this.page.locator(teks).click();
    }
}