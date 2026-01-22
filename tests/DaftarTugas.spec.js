import { test } from "@playwright/test";
import { menuSidebar } from "../pages/Navigate/menuSidebar";
import { navigateUrl } from "../pages/Navigate/navigateUrl";
import { search } from "../pages/Search/search";

test.use({ storageState: 'user.json' });
test.describe('Daftar Tugas', () => {
    let url, sidebar;

    const runSearchTest = async (page, column, keyword) => {
        const inputSearch = new search(page, column);
        await inputSearch.search(keyword);
    }

    test.beforeEach(async ({ page }) => {
        url = new navigateUrl(page);
        sidebar = new menuSidebar(page);

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
})