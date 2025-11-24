import test from "@playwright/test";
import { formLogin } from "../pages/login/formLogin";
import { logoutAction } from "../pages/logout/logoutAction";

test.describe('Logout', () => {
    let login, logout;

    test.beforeEach(async ({ page }) => {
        login = new formLogin(page);
        logout = new logoutAction(page);
    
        //Login
        await login.navigate('https://hse-staging.transtrack.id/login');
        await login.usernameInput('bagas@transtrack.id');
        await login.passwordInput('Password123@');
        await login.buttonLogin();
        await login.checkUrl('https://hse-staging.transtrack.id/dashboard');
    })

    test('Logout - Batal', async ({ page }) => {
        await logout.clickLogout();
        await logout.popup();
        //Check
        await login.checkUrl('https://hse-staging.transtrack.id/dashboard');
    })

    test('Logout - Konfirmasi', async ({ page }) => {
        await logout.clickLogout();
        await logout.popup('Log out');
        //Check
        await login.checkUrl('https://hse-staging.transtrack.id/login');
    })
})