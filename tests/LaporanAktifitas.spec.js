import { test } from "@playwright/test";
import { navigateUrl } from "../pages/Navigate/navigateUrl";
import { menuSidebar } from "../pages/Navigate/menuSidebar";
import { filter } from "../pages/Filter/filter";
import { button } from "../pages/Button/button";

test.use({ storageState: 'user.json' });
test.describe('Manajemen Role', () => {
    let url, sidebar, sortir, tombol;

        test.beforeEach(async ({ page }) => {
            url = new navigateUrl(page);
            sidebar = new menuSidebar(page);
            sortir = new filter(page);
            tombol = new button(page);

            await url.navigate('https://mytask-staging.transtrack.id/dashboard');
            await url.checkUrl('https://mytask-staging.transtrack.id/dashboard')

            //Klik Menu Laporan Aktifitas
            await sidebar.clickSidebar('#menuActivityReport');
            await url.checkUrl('https://mytask-staging.transtrack.id/activity-report');
        })

        test.describe('Laporan Aktifitas - Kategori', () => {
            test('Select Kategori', async () => {
                await sortir.filterDropdown('Kategori', 'Inspeksi Hasil Tambang');
            })
            test('Empty Kategori', async () => {
                await sortir.filterDropdown('Kategori', '');
            })
        })

        test.describe('Laporan Aktifitas - Filter', () => {
            test.beforeEach(async () => {
                await sortir.filterDropdown('Kategori', ''); 
                await sortir.filterOption();               
            })

            test('Select Karyawan', async ({ page }) => {
                await sortir.filterDropdown('Karyawan', 'Mobile');
                await tombol.checkAndClick('Terapkan Filter');
                await page.mouse.click(50, 50);
            })

            test('Date Range', async ({ page }) => {
                await sortir.filterDateRange(
                    '2025', 'Dec', '17',
                    '2025', 'Dec', '20'
                );
                await tombol.checkAndClick('Terapkan Filter');
                await page.mouse.click(50, 50);
                await sortir.runFIlterTest(2);
            })
        })
})