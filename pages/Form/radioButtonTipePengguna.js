export class radioButtonTipePengguna {
    constructor(page){
        this.page = page;
    }

    async selectTipePengguna(tipePengguna){
        await this.page.getByRole('radio', { name: tipePengguna }).check();
    }

    async checkField(){
        
    }
}