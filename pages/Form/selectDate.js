import { expect } from "@playwright/test";

export class selectDate{
    constructor(page){
        this.page = page;
        this.inputDeadline = page.locator('#deadline');
    }

    async tenggatWaktu(tahunDl, bulanDl, tanggalDl){
        await this.inputDeadline.click();

        await this.page.waitForTimeout(500);
        await expect(
            this.page.getByRole('grid', { name: 'Calendar wrapper' })
        ).toBeVisible()

        console.log(`✅ [SUCCESS] Kalender deadline terbuka`);

        await this.selectTanggal(tahunDl, bulanDl, tanggalDl);

        await this.page.getByRole('button', { name: 'Confirm' }).click();
    }

    async getCurrentMonthYear() {
        const monthBtn = this.page.getByRole('button', { name: 'Open months overlay' });
        const yearBtn  = this.page.getByRole('button', { name: 'Open years overlay' });

        const bulanSekarang = (await monthBtn.innerText()).trim();
        const tahunSekarang = (await yearBtn.innerText()).trim();

        return { bulanSekarang, tahunSekarang, monthBtn, yearBtn };
    }

    async selectTanggal(tahun, bulan, tanggal){
        try {
            const { bulanSekarang, tahunSekarang, monthBtn, yearBtn } = await this.getCurrentMonthYear();

            const actions = [
                { current: tahunSekarang, value: tahun, btn: yearBtn },
                { current: bulanSekarang, value: bulan, btn: monthBtn },
            ];

            for (const a of actions) {
                if (a.value !== a.current) {
                    await a.btn.click();
                    await this.page
                        .getByText(a.value, { exact: true })
                        .click();
                }
            }

            const tanggal2Digit = String(tanggal - 1).padStart(2, '0');
            const mapBulan = {
                Jan: 1,
                Feb: 2,
                Mar: 3,
                Apr: 4,
                May: 5,
                Jun: 6,
                Jul: 7,
                Aug: 8,
                Sep: 9,
                Oct: 10,
                Nov: 11,
                Dec: 12,
            };
            const bulan2Digit = String(mapBulan[bulan]).padStart(2, '0');

            await this.page.locator(`[id="${tahun}-${bulan2Digit}-${tanggal2Digit}"]`).click();
            
            console.log(`✅ [SUCCESS] Tanggal deadline dipilih: ${tanggal} ${bulan} ${tahun}`);
        } catch (error) {
            console.error(`❌ [FAILED] Gagal pilih tanggal deadline: ${tanggal} ${bulan} ${tahun}`);
            throw error;
        }
    }
}