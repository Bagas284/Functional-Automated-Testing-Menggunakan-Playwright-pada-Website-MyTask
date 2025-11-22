import { expect } from "@playwright/test";

export class filter{
    constructor(page){
        this.page = page;
        this.opsiFilter = page.getByRole('button', { name: 'Filters' });
        this.labelFilter = page.getByLabel('Filters');
        this.inputDatePicker = page.getByRole('textbox', { name: 'Datepicker input' });


    }

    async filterOption(){
        await this.opsiFilter.click();
        await expect(this.labelFilter).toBeVisible();
    }

    async filterDateRange(){
        await this.inputDatePicker.click();
    }
}