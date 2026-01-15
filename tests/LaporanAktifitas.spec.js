import { test } from "@playwright/test";
import { navigateUrl } from "../pages/Navigate/navigateUrl";
import { menuSidebar } from "../pages/Navigate/menuSidebar";
import { filter } from "../pages/Filter/filter";
import { button } from "../pages/Button/button";
import { search } from "../pages/Search/search";
import { checkData } from "../pages/Cek Data/checkData";

test.use({ storageState: 'user.json' });
test.describe('Manajemen Role', () => {
    let url, sidebar, sortir, tombol, detailData;
    const runSearchTest = async (page, column, keyword) => {
        const inputSearch = new search(page, column);
        await inputSearch.search(keyword);
    }

        test.beforeEach(async ({ page }) => {
            url = new navigateUrl(page);
            sidebar = new menuSidebar(page);
            sortir = new filter(page);
            tombol = new button(page);
            detailData = new checkData(page);

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

        test.describe('Laporan Aktifitas - Search', () => {
            test.beforeEach(async () => {
                await sortir.filterDropdown('Kategori', ''); 
            })
            test('Search Karyawan Terdata', async ({ page }) => {
                await runSearchTest(page, 2, "Mobile");
            })

            test('Search Karyawan Tidak Terdata', async ({ page }) => {
                await runSearchTest(page, 2, "Bagas");
            })
        })

        test.describe('Laporan Aktifitas - Detail', () => {
            test.beforeEach(async ({ page }) => {
                await sortir.filterDropdown('Kategori', ''); 
                await runSearchTest(page, 2, 'Mobile');
                await tombol.moreOption('2 Mobile Inspeksi Hasil', 'Detail');
            })

            test('Detail Laporan - File Pendukung', async () => {
                await detailData.cekFilePendukug('Lampiran', 1);
                await detailData.cekFilePendukug('File', 1);
                await detailData.cekFilePendukug('Tanda Tangan', 1);
            })

            test('Detail Laporan - Kesesuaian Data', async () => {
                await detailData.detailCheckData('Mobile');
                await detailData.detailCheckData('2025-12-16 10:25');
                await detailData.detailCheckData('Inspeksi Hasil Tambang');
                await detailData.detailCheckData('TransTRACK.ID Bandung, 24, Jalan Emong, Burangrang, Lengkong, Bandung, Jawa Barat, Jawa, 40262, Indonesia');
                await detailData.cekFilePendukug('Lampiran', 1);
                await detailData.cekFilePendukug('File', 1);
                await detailData.cekFilePendukug('Tanda Tangan', 1);
            })
        })
})