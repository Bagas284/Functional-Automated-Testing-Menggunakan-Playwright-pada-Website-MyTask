import { test } from '@playwright/test';
import { navigateUrl } from '../pages/navigateUrl';
import { formLogin } from '../pages/login/formLogin';
import { notifikasi } from '../pages/notifikasi/notifikasi';
import { lihatPassword } from '../pages/login/lihatPassword';

test.describe('Login', () => {
    let login;
    let notif;

    test.beforeEach(async ({ page }) => {
        const url = new navigateUrl(page);

        await url.navigate('https://hse-staging.transtrack.id/login');
    })
    
    test('Login Berhasil', async ({ page }) => {
        login = new formLogin(page);

        await login.usernameInput('bagas@transtrack.id');
        await login.passwordInput('Password123@');
        await login.buttonLogin();

        await login.checkUrl('https://hse-staging.transtrack.id/dashboard');
    })

    test('Login dengan Email Tidak Terdaftar', async ({ page }) => {
        login = new formLogin(page);
        notif = new notifikasi(page);

        await login.usernameInput('bagas1@transtrack.id');
        await login.passwordInput('Password123@');
        await login.buttonLogin();

        await notif.notificationCheck('Email atau password tidak sesuai');
    })

    test('Login dengan Input Password Salah', async({ page }) => {
        login = new formLogin(page);
        notif = new notifikasi(page);

        await login.usernameInput('bagas@transtrack.id');
        await login.passwordInput('Password@');
        await login.buttonLogin();

        await notif.notificationCheck('Email atau password tidak sesuai');     
    })

    test('Lihat Password', async({ page }) => {
        login = new formLogin(page);
        const lihat = new lihatPassword(page);

        await login.usernameInput('bagas@transtrack.id');
        await login.passwordInput('Password123@')
        
        await login.expectMasked();

        await lihat.eyeButton();

        await login.expectVisible();
    })
})