import { test } from '@playwright/test';
import { navigateUrl } from '../pages/Navigate/navigateUrl';
import { formLogin } from '../pages/Login/formLogin';
import { notifikasi } from '../pages/Notifikasi/notifikasi';

test.describe('Login', () => {
    let url, login, notif;

    test.beforeEach(async ({ page }) => {
        url = new navigateUrl(page);
        login = new formLogin(page);
        notif = new notifikasi(page);

        await url.navigate('https://mytask-staging.transtrack.id/login');
    })

    test('Login dengan Akun Terdaftar', async () => {
        await login.usernameInput('bagas@transtrack.id');
        await login.passwordInput('Password123@');
        await login.buttonLogin();

        await url.checkUrl('https://mytask-staging.transtrack.id/dashboard');
    })

    test('Login dengan Akun Tidak Terdaftar', async () => {
        await login.usernameInput('bagas1@transtrack.id');
        await login.passwordInput('Password12@');
        await login.buttonLogin();

        await url.checkUrl('https://mytask-staging.transtrack.id/login');
        await notif.notificationCheck();
    })
})