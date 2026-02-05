import test from "@playwright/test";
import { navigateUrl } from "../pages/Navigate/navigateUrl";
import { menuSidebar } from "../pages/Navigate/menuSidebar";
import { search } from "../pages/Search/search";

test.use({ storageState: 'user.json' });
test.describe('Pengguna', () => {
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
})