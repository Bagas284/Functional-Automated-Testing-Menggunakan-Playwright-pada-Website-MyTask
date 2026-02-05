import test from "@playwright/test";
import { navigateUrl } from "../pages/Navigate/navigateUrl";
import { menuSidebar } from "../pages/Navigate/menuSidebar";
import { search } from "../pages/Search/search";
import { filter } from "../pages/Filter/filter";
import { button } from "../pages/Button/button";

test.use({ storageState: 'user.json' });
test.describe('Pengguna', () => {
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

        //Klik Menu Pengguna
        await sidebar.clickSidebar('#menuUsers');
        await url.checkUrl('https://mytask-staging.transtrack.id/users');
    })

    test.describe('Pengguna - Search', () => {
        test('Search Nama Pengguna Terdata', async ({ page }) => {
            await runSearchTest(page, 1, "Bagas Magang");
        })
        test('Search Nama Pengguna Tidak Terdata', async ({ page }) => {
            await runSearchTest(page, 1, "Bagas Aldianata");
        })
    })

    test.describe('Pengguna - Filter', () => {
        test.beforeEach(async () => {
            await sortir.filterOption();
        })
        test('Select Role', async ({ page }) => {
            await sortir.filterDropdown('Role', 'Administrator');
            await tombol.checkAndClick('Terapkan Filter');
            await page.mouse.click(50, 50);
            await page.waitForTimeout(1000);
            await runFIlterTest(page, 3);
        })
        test('Date Range', async ({ page }) => {
            await sortir.filterDateRange(
                'range',
                '2026', 'Jan', '8',
                '2026', 'Jan', '11'
            );
            await tombol.checkAndClick('Terapkan Filter');
            await page.mouse.click(50, 50);
            await page.waitForTimeout(1000);
            await runFIlterTest(page, 1);
        })
    })
})