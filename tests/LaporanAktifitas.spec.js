import { test } from "@playwright/test";
import { navigateUrl } from "../pages/Navigate/navigateUrl";
import { menuSidebar } from "../pages/Navigate/menuSidebar";
import { filter } from "../pages/Filter/filter";
import { button } from "../pages/Button/button";
import { search } from "../pages/Search/search";
import { checkData } from "../pages/Cek Data/checkData";

test.use({ storageState: 'user.json' });
test.describe('Laporan Aktifitas', () => {
    let url, sidebar, sortir, tombol, detailData;
    const runSearchTest = async (page, column, keyword) => {
        const inputSearch = new search(page, column);
        await inputSearch.search(keyword);
    }

    const runFIlterTest = async (page, column) => {
        const inputSearch = new search(page, column);
        await inputSearch.checkSearch();
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
            test('Select Kategori', async ({ page }) => {
                await sortir.filterDropdown('Kategori', 'Inspeksi Tambang Batu Bara');
                await page.waitForTimeout(1000);
                await runFIlterTest(page, 2);
            })
        })

        test.describe('Laporan Aktifitas - Filter', () => {
            test.beforeEach(async () => {
                await sortir.filterDropdown('Kategori', ''); 
                await sortir.filterOption();               
            })

            test('Select Karyawan', async ({ page }) => {
                await sortir.filterDropdown('Karyawan', 'Bagas Aldinata Mobile');
                await tombol.checkAndClick('Terapkan Filter');
                await page.mouse.click(50, 50);
                await page.waitForTimeout(1000);
                await runFIlterTest(page, 2);
            })

            test('Date Range', async ({ page }) => {
                await sortir.filterDateRange(
                    'range',
                    '2026', 'Apr', '1',
                    '2026', 'Apr', '7'
                );
                await tombol.checkAndClick('Terapkan Filter');
                await page.mouse.click(50, 50);
                await page.waitForTimeout(1000);
                await runFIlterTest(page, 2);
            })
        })

        test.describe('Laporan Aktifitas - Search', () => {
            test.beforeEach(async () => {
                await sortir.filterDropdown('Kategori', ''); 
            })
            test('Search Karyawan Terdata', async ({ page }) => {
                await runSearchTest(page, 2, "Bagas Aldinata Mobile");
            })

            test('Search Karyawan Tidak Terdata', async ({ page }) => {
                await runSearchTest(page, 2, "Joko");
            })
        })

        test.describe('Laporan Aktifitas - Detail', () => {
            test.beforeEach(async ({ page }) => {
                await sortir.filterDropdown('Kategori', ''); 
                await runSearchTest(page, 2, 'Bagas Aldinata Mobile');
                await tombol.moreOption('1 Bagas Aldinata Mobile Inspeksi Tambang Batu Bara', 'Detail');
            })

            test('Detail Laporan - File Pendukung', async () => {
                await detailData.cekFilePendukug('Lampiran', 1);
                await detailData.cekFilePendukug('File', 1);
                await detailData.cekFilePendukug('Tanda Tangan', 1);
            })

            test('Detail Laporan - Kesesuaian Data', async () => {
                await detailData.detailCheckData('Bagas Magang Mobile');
                await detailData.detailCheckData('2026-04-07 16:55');
                await detailData.detailCheckData('Inspeksi Tambang Batu Bara');
                await detailData.detailCheckData('Bojongsoang Asri 1, Citeureup, Bandung, Jawa Barat, Jawa, 40288, Indonesia');
                await detailData.cekFilePendukug('Lampiran', 1);
                await detailData.cekFilePendukug('File', 1);
                await detailData.cekFilePendukug('Tanda Tangan', 1);
            })
        })
})