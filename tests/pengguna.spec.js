import test from "@playwright/test";
import { formLogin } from "../pages/login/formLogin";
import { sidebar } from "../pages/sidebar";
import { search } from "../pages/search/search";
import { filter } from "../pages/filter/filter";

test.describe('Pengguna', () => {
    let login, sidebarClick, filterOpsi;

    const runSearchTest = async (page, column, keyword) => {
        const inputSearch = new search(page, column);
        await inputSearch.search(keyword);
        await inputSearch.checkSearch();
    }

    test.beforeEach(async ({ page }) => {
            login = new formLogin(page);
            sidebarClick = new sidebar(page);
            filterOpsi = new filter(page);
    
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
        test('Search By Nama Pengguna - Search Nama Pengguna Terdata', async ({ page }) => {
            await runSearchTest(page, 1, "Bagas Intern QA");
        })

        test('Empty Searcy', async ({ page }) => {
            await runSearchTest(page, 1, "");
        })

        test('Search Tidak Terdata', async ({ page }) => {
            await runSearchTest(page, 1, "Farhan");
        })
    })

    test.describe('Pengguna - Filter', () => {
        test.beforeEach(async ({ page }) => {
            await filterOpsi.filterOption();
        })

        test('Date Range', async ({ page }) => {
            await filterOpsi.filterDateRange();
        })
    })
})