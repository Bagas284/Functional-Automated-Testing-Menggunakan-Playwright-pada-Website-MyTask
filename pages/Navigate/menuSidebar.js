export class menuSidebar {
    constructor (page){
        this.page = page;
    }

    async clickSidebar(teks){
        await this.page.locator(teks).click();
        console.log(`User diarahkan ke ${teks}`);
    }
}