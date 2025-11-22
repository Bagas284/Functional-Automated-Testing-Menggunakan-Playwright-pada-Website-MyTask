import { expect } from "@playwright/test";

export class checkboxRole{
    constructor(page){
        this.page = page;
        this.table = page.locator('table');
    }
    // Select role (click fitur / nama role)
    async selectRole(roleName){
        for(roleName of roleName){
            const checkbox = this.page.getByRole('cell', { name: roleName }).getByRole('checkbox');
            await checkbox.check();
            await expect(checkbox).toBeChecked();
        }
    }

    async selectPermission(featureName, actionName) {
        const row = this.page.getByRole('row', { name: featureName });

        // Tentukan kolom berdasarkan action
        const columnIndex = {
            view: 2,
            create: 3,
            edit: 4,
            delete: 5
        }[actionName.toLowerCase()];
        const checkbox = row.locator(`td:nth-child(${columnIndex}) input[type="checkbox"]`);

        // Klik checkbox
        await checkbox.check();

        // Validasi checkbox tercentang
        await expect(checkbox).toBeChecked();
    }

    async uncheckRole(roleName){
        for(roleName of roleName){
            const checkbox = this.page.getByRole('cell', { name: roleName }).getByRole('checkbox');
            await checkbox.uncheck();
            // await expect(checkbox).toBeChecked();
        }
    }
}