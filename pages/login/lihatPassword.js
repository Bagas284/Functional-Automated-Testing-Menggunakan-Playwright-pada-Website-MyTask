export class lihatPassword {
    constructor(page){
        this.page = page;
    }

    async eyeButton(){
          await this.page.getByRole('button').filter({ hasText: /^$/ }).click();
    }
}