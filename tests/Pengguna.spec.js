import test from "@playwright/test";
import { navigateUrl } from "../pages/Navigate/navigateUrl";
import { menuSidebar } from "../pages/Navigate/menuSidebar";
import { search } from "../pages/Search/search";
import { filter } from "../pages/Filter/filter";
import { button } from "../pages/Button/button";
import { radioButton } from "../pages/Form/radioButton";
import { form } from "../pages/Form/form";
import { dropdownSelect } from "../pages/Form/dropdownSelect";
import { notifikasi } from "../pages/Notifikasi/notifikasi";

test.use({ storageState: 'user.json' });
test.describe('Pengguna', () => {
    let url, sidebar, sortir, tombol, tipePengguna, inputForm, selectField, notif;

    const penggunaWeb = {
        tipePengguna: 'Web User',
        role: 'Administrator',
        namaPengguna: 'Bagas Aldinata Web',
        email: 'bagasaldianataweb@transtrack.id',
        noTelpon: '0987654321',
        kataSandi: 'Password123@'
    }

    const penggunaMobile = {
        tipePengguna: 'Mobile User',
        namaPengguna: 'Bagas Aldinata Mobile',
        email: 'bagasaldianatamobile@transtrack.id',
        noTelpon: '009988776655',
        pinAkun: '123456'
    }

    const runSearchTest = async (page, column, keyword) => {
        const inputSearch = new search(page, column);
        await inputSearch.search(keyword);
    }
    const runFIlterTest = async (page, column) => {
        const inputSearch = new search(page, column);
        await inputSearch.checkSearch();
    }

    test.beforeEach(async ({ page }) => {
        url = new navigateUrl(page);
        sidebar = new menuSidebar(page);
        sortir = new filter(page);
        tombol = new button(page);
        tipePengguna = new radioButton(page);
        inputForm = new form(page);
        selectField = new dropdownSelect(page);
        notif = new notifikasi(page);

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

    test.describe('Pengguna - Filter', () => {
        test.beforeEach(async () => {
            await sortir.filterOption();
        })
        test('Select Role', async ({ page }) => {
            await sortir.filterDropdown('Role', 'Administrator');
            await tombol.checkAndClick('Terapkan Filter');
            await page.mouse.click(50, 50);
            await page.waitForTimeout(1000);
            await runFIlterTest(page, 3);
        })
        test('Date Range', async ({ page }) => {
            await sortir.filterDateRange(
                'range',
                '2026', 'Jan', '8',
                '2026', 'Jan', '11'
            );
            await tombol.checkAndClick('Terapkan Filter');
            await page.mouse.click(50, 50);
            await page.waitForTimeout(1000);
            await runFIlterTest(page, 1);
        })
    })

    test.describe('Pengguna - Tambah Pengguna', () => {
        test.beforeEach(async () => {
            await tombol.checkAndClick('Tambah');
            await url.checkUrl('https://mytask-staging.transtrack.id/users/create');
        })

        test.describe('Pengguna Web', () => {
            test('Tambah Pengguna Web Dengan Mengisi Semua Field', async ({ page }) => {
                await tipePengguna.selectRadioButton(penggunaWeb.tipePengguna);
                await selectField.fieldDropdown('Role', penggunaWeb.role);
                await inputForm.formInput('Nama Pengguna', penggunaWeb.namaPengguna);
                await inputForm.formInput('Email', penggunaWeb.email);
                await inputForm.formInput('Nomor Telepon', penggunaWeb.noTelpon);
                await inputForm.formInput('Kata Sandi', penggunaWeb.kataSandi);
                await tombol.checkAndClick('Simpan');
                //Cek
                await url.checkUrl('https://mytask-staging.transtrack.id/users');
                await notif.notificationCheck();
                await runSearchTest(page, 1, penggunaWeb.namaPengguna);
            })

            test('Input Dengan Mengosongkan Semua Field', async ({ page }) => {
                await tipePengguna.selectRadioButton(penggunaWeb.tipePengguna);
                await selectField.fieldDropdown('Role', penggunaWeb.role);
                await inputForm.formInput('Nama Pengguna', '');
                await inputForm.formInput('Email', '');
                await inputForm.formInput('Nomor Telepon', '');
                await inputForm.formInput('Kata Sandi', '');
                await tombol.checkAndClick('Simpan');
                //Cek
                await url.checkUrl('https://mytask-staging.transtrack.id/users/create');
                await notif.notificationCheck();
            })
        })

        test.describe('Pengguna Mobile', () => {
            test('Tambah Pengguna Web Dengan Mengisi Semua Field', async ({ page }) => {
                await tipePengguna.selectRadioButton(penggunaMobile.tipePengguna);
                await inputForm.formInput('Nama Pengguna', penggunaMobile.namaPengguna);
                await inputForm.formInput('Email', penggunaMobile.email);
                await inputForm.formInput('Nomor Telepon', penggunaMobile.noTelpon);
                await inputForm.formInput('PIN Akun', penggunaMobile.pinAkun);
                await tombol.checkAndClick('Simpan');
                //Cek
                await url.checkUrl('https://mytask-staging.transtrack.id/users');
                await notif.notificationCheck();
                await runSearchTest(page, 1, penggunaMobile.namaPengguna);
            })

            test('Input Dengan Mengosongkan Semua Field', async ({ page }) => {
                await tipePengguna.selectRadioButton(penggunaMobile.tipePengguna);
                await inputForm.formInput('Nama Pengguna', '');
                await inputForm.formInput('Email', '');
                await inputForm.formInput('Nomor Telepon', '');
                await inputForm.formInput('PIN Akun', '');
                await tombol.checkAndClick('Simpan');
                //Cek
                await url.checkUrl('https://mytask-staging.transtrack.id/users/create');
                await notif.notificationCheck();
            })
        })
    })
})