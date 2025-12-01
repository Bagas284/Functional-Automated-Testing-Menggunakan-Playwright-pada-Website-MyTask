import test from "@playwright/test";
import { formLogin } from "../pages/login/formLogin";
import { sidebar } from "../pages/sidebar";
import { search } from "../pages/search/search";
import { filter } from "../pages/filter/filter";
import { button } from "../pages/button";

test.describe('Pengguna', () => {
    let login, sidebarClick, filterOpsi, buttonAction;

    test.beforeEach(async ({ page }) => {
            login = new formLogin(page);
            sidebarClick = new sidebar(page);
            filterOpsi = new filter(page);
            buttonAction = new button(page);
    
            //Login
            await login.navigate('https://hse-staging.transtrack.id/login');
            await login.usernameInput('bagas@transtrack.id');
            await login.passwordInput('Password123@');
            await login.buttonLogin();
            await login.checkUrl('https://hse-staging.transtrack.id/dashboard');
    
            //Masuk menu role
            await sidebarClick.clickSidebar('#menuUsers');
            await login.checkUrl('https://hse-staging.transtrack.id/users');
    })

    test.describe('Pengguna - Search', () => {
        const runSearchTest = async (page, column, keyword) => {
            const inputSearch = new search(page, column);
            await inputSearch.search(keyword);
            await inputSearch.checkSearch();
        }

        test('Search By Nama Pengguna - Search Nama Pengguna Terdata', async ({ page }) => {
            await runSearchTest(page, 1, "Bagas Intern QA");
        })

        test('Empty Searcy', async ({ page }) => {
            await runSearchTest(page, 1, "");
        })

        test('Search Tidak Terdata', async ({ page }) => {
            await runSearchTest(page, 1, "Farhan");
        })

        test('Search By Nama Pengguna - Search Nama Pengguna Setelah Melakukan Filter Date Range', async ({ page }) => {
            await filterOpsi.filterDateRange(
                '2025', 'Oct', '20',
                '2025', 'Oct', '23'
            );
            await buttonAction.checkAndClick('Terapkan Filter');
            await runSearchTest(page, 1, "Bagas Intern QA");
        })

        test('Search By Nama Pengguna - Search Nama Pengguna Setelah Melakukan Filter Role', async ({ page }) => {
            await filterOpsi.selectRole('Admin');
            await buttonAction.checkAndClick('Terapkan Filter');
            await runSearchTest(page, 1, "Bagas Intern QA");
        })

        test.afterEach(async ({ page }) => {
            await page.mouse.click(50, 50);
        })
    })

    test.describe('Pengguna - Filter', () => {
        const runFIlterTest = async (page, column) => {
            const inputSearch = new search(page, column);
            await inputSearch.checkSearch();
        }

        test.beforeEach(async ({ page }) => {
            await filterOpsi.filterOption();
        })

        test('Date Range', async ({ page }) => {
            await filterOpsi.filterDateRange(
                '2025', 'Oct', '20',
                '2025', 'Oct', '23'
            );
            await buttonAction.checkAndClick('Terapkan Filter');
            await runFIlterTest(page, 7);
        })

        test('Select Role', async ({ page }) => {
            await filterOpsi.selectRole('Supervisor');
            await buttonAction.checkAndClick('Terapkan Filter');
            await runFIlterTest(page, 3);
        })

        test('Hapus Semua Filter', async ({ page }) => {
            await filterOpsi.filterDateRange(
                '2025', 'Oct', '20',
                '2025', 'Oct', '23'
            );
            await filterOpsi.selectRole('Supervisor');
            await buttonAction.checkAndClick('Reset');
            await runFIlterTest(page, 1);
        })

        test.afterEach(async ({ page }) => {
            await page.mouse.click(50, 50);
        })
    })
})