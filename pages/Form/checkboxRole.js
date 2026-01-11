import { expect } from "@playwright/test";

export class checkboxRole {
    constructor(page) {
        this.page = page;
    }

    async selectRole({ feature = [], role = [], action = [] } = {}) {
        if (feature.length === 0) {
            console.log('⚠️ [EMPTY] Feature kosong');
        } else {
            for (const roleName of feature) {
                let checkbox;

                // Select All (Fitur)
                if (roleName === 'Fitur') {
                    checkbox = this.page
                        .getByRole('columnheader', { name: roleName })
                        .getByRole('checkbox');
                } else {
                    // Select per nama fitur
                    checkbox = this.page
                        .getByRole('cell', { name: roleName })
                        .getByRole('checkbox');
                }

                await expect(
                    checkbox,
                    `❌ [FAILED] Checkbox '${roleName}' tidak ditemukan`
                ).toBeVisible();

                await checkbox.check();
                await expect(checkbox).toBeChecked();

                console.log(`✅ [SUCCESS] Checkbox '${roleName}' berhasil dicentang`);
            }
        }

        if (role.length === 0 || action.length === 0) {
            console.log('⚠️ [EMPTY] Role atau Action kosong');
            return;
        }

        const columnMap = {
            view: 2,
            create: 3,
            edit: 4,
            delete: 5
        };

        for (const act of action) {
            const colIndex = columnMap[act.toLowerCase()];

            if (!colIndex) {
                console.log(`❌ [ACTION INVALID] Action "${act}" tidak ditemukan`);
                continue;
            }

            for (const roles of role) {
                try {
                    const checkbox = this.page
                        .locator('tr', { hasText: roles })
                        .locator(`td:nth-child(${colIndex}) input[type="checkbox"]`);

                    await expect(checkbox).toBeVisible();
                    await checkbox.check();
                    await expect(checkbox).toBeChecked();

                    console.log(`✅ [SUCCESS] Role: "${roles}" | Action: "${act}"`);
                } catch (error) {
                    console.log(`❌ [FAILED] Role: "${roles}" | Action: "${act}"`);
                    console.log(`   ↳ Reason: ${error.message}`);
                }
            }
        }
    }
}