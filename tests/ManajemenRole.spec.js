import test from "@playwright/test";
import { navigateUrl } from "../pages/Navigate/navigateUrl";
import { menuSidebar } from "../pages/Navigate/menuSidebar";
import { search } from "../pages/Search/search";

test.use({ storageState: 'user.json' });
test.describe('Manajemen Role', () => {
    let url, sidebar;

    const runSearchTest = async (page, column, keyword) => {
        const inputSearch = new search(page, column);
        await inputSearch.search(keyword);
        await inputSearch.checkSearch();
    }

    test.beforeEach(async ({ page }) => {
        url = new navigateUrl(page);
        sidebar = new menuSidebar(page);

        await url.navigate('https://mytask-staging.transtrack.id/dashboard');
        await url.checkUrl('https://mytask-staging.transtrack.id/dashboard')

        //Klik Menu Role
        await sidebar.clickSidebar('#menuRoles');
        await url.checkUrl('https://mytask-staging.transtrack.id/roles');
    })

    test.describe('Manajemen Role - Search', () => {
        test('Search Role Terdata', async ({ page }) => {
            await runSearchTest(page, 2, "Supervisor");
        })

        test('Search Role Tidak Terdata', async ({ page }) => {
            await runSearchTest(page, 2, "Pegawai");
        })
    })
})