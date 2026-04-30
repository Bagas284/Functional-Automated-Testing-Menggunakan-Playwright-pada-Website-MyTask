import { test } from '@playwright/test';
import { logoutAction } from "../pages/Logout/logoutAction";
import { navigateUrl } from "../pages/Navigate/navigateUrl";

test.use({ storageState: 'user.json' });
test.describe("Logout", () => {
    let logout, url;

    test.beforeEach(async ({ page }) => {
        logout = new logoutAction(page);
        url = new navigateUrl(page);

        await url.navigate('https://mytask-staging.transtrack.id/dashboard');
        await url.checkUrl('https://mytask-staging.transtrack.id/dashboard');

        await logout.clickLogout();
    })
    test('Konfirmasi Logout', async ({ page }) => {
        await logout.popup('Log out');
        //Check
        await url.checkUrl('https://mytask-staging.transtrack.id/login');
    })

    test('Logout - Batal', async ({ page }) => {
        await logout.popup('Tidak, Kembali');
        //Check
        await url.checkUrl('https://mytask-staging.transtrack.id/dashboard');
    })
})