import { test } from "@playwright/test";
import { menuSidebar } from "../pages/Navigate/menuSidebar";
import { navigateUrl } from "../pages/Navigate/navigateUrl";
import { search } from "../pages/Search/search";
import { filter } from "../pages/Filter/filter";
import { button } from "../pages/Button/button";

test.use({ storageState: 'user.json' });
test.describe('Daftar Tugas', () => {
    let url, sidebar, sortir, tombol;

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

        await url.navigate('https://mytask-staging.transtrack.id/dashboard');
        await url.checkUrl('https://mytask-staging.transtrack.id/dashboard')

        //Klik Menu Daftar Tugas
        await sidebar.clickSidebar('#menuTasks');
        await url.checkUrl('https://mytask-staging.transtrack.id/tasks');
    })

    test.describe('Daftar Tugas - Search', () => {
        test('Search Daftar Tugas Terdata', async ({ page }) => {
            await runSearchTest(page, 1, "Pemasangan Router");
        })

        test('Search Daftar Tugas Tidak Terdata', async ({ page }) => {
            await runSearchTest(page, 1, 'Pemasangan WIFI');
        })
    })

    test.describe('Daftar Tugas - FIlter', () => {
        test.beforeEach(async () => {
            await sortir.filterOption();               
        })
        test('Select Karyawan', async ({ page }) => {
            await sortir.filterDropdown('Karyawan', 'Mobile');
            await tombol.checkAndClick('Terapkan Filter');
            await page.mouse.click(50, 50);
            await runFIlterTest(page, 1);
        })

        test('Select Status', async ({ page }) => {
            await sortir.filterStatus(['Batal']);
            await tombol.checkAndClick('Terapkan Filter');
            await page.mouse.click(50, 50);
            await runFIlterTest(page, 1);
        })

        test('Date Range', async ({ page }) => {
            await sortir.filterDateRange(
                'start',
                '2026', 'Jan', '1'
            );
            await sortir.filterDateRange(
                'end',
                '2026', 'Jan', '2'
            );
            await tombol.checkAndClick('Terapkan Filter');
            await page.mouse.click(50, 50);
            await runFIlterTest(page, 1);
        })
    })
})