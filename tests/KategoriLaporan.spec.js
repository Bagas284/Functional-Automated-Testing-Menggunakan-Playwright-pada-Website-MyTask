import { test } from "@playwright/test";
import { navigateUrl } from "../pages/Navigate/navigateUrl";
import { menuSidebar } from "../pages/Navigate/menuSidebar";
import { search } from "../pages/Search/search";

test.use({ storageState: 'user.json' });
test.describe('Kategori Laporan', () => {
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

            //Klik Menu Kategori Laporan
            await sidebar.clickSidebar('#menuTaskType', 1);
            await url.checkUrl('https://mytask-staging.transtrack.id/report-category');
        })

        test.describe('Kategori Laporan - Search', () => {
            test('Search Nama Laporan Terdata', async ({ page }) => {
                await runSearchTest(page, 2, "Inspeksi Hasil Tambang");
            })

            test('Search Nama Laporan Tidak Terdata', async ({ page }) => {
                await runSearchTest(page, 2, 'Inspeksi Karyawan');
            })
        })
})