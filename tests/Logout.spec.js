import { test } from '@playwright/test';
import { logoutAction } from "../pages/Logout/logoutAction";
import { navigateUrl } from "../pages/Navigate/navigateUrl";

test.use({ storageState: 'user.json' });
test.describe("Logout", () => {
    test('Konfirmasi Logout', async ({ page }) => {
        const logout = new logoutAction(page);
        const url = new navigateUrl(page);

        await url.navigate('https://mytask-staging.transtrack.id/dashboard');
        await url.checkUrl('https://mytask-staging.transtrack.id/dashboard');

        await logout.clickLogout();
        await logout.popup('Log out');
        //Check
        await url.checkUrl('https://mytask-staging.transtrack.id/login');
    })
})