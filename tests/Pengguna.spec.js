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
import { checkData } from "../pages/Cek Data/checkData";
import { popup } from "../pages/Notifikasi/popup";

test.use({ storageState: 'user.json' });
test.describe('Pengguna', () => {
    let url, sidebar, sortir, tombol, tipePengguna, inputForm, selectField, notif, detailData, havePopup;

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

    const penggunaWebBaru = {
        role: 'Supervisor',
        namaPengguna: 'Bagas Magang Website',
        noTelpon: '111111111111',
    }

    const penggunaMobileBaru = {
        namaPengguna: 'Bagas Magang Mobile',
        noTelpon: '222222222222',
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
        detailData = new checkData(page);
        havePopup = new popup(page);

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
            test('Tambah Pengguna Dengan Mengisi Semua Field', async ({ page }) => {
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

            test('Input Dengan Mengosongkan Semua Field', async () => {
                await tipePengguna.selectRadioButton(penggunaWeb.tipePengguna);
                await selectField.fieldDropdown('Role', '');
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
            test('Tambah Pengguna Dengan Mengisi Semua Field', async ({ page }) => {
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

            test('Input Dengan Mengosongkan Semua Field', async () => {
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

    test.describe('Pengguna - Detail Pengguna', () => {
        test.beforeEach(async ({ page }) => {
            await runSearchTest(page, 1, penggunaWeb.namaPengguna);
            await tombol.moreOption(penggunaWeb.namaPengguna, 'Detail');
        })

        test('Detail Pengguna - Kesesuaian Data', async () => {
            await detailData.detailCheckData('WEB');
            await detailData.detailCheckData(penggunaWeb.role);
            await detailData.detailCheckData(penggunaWeb.namaPengguna);
            await detailData.detailCheckData(penggunaWeb.email);
            await detailData.detailCheckData(penggunaWeb.noTelpon);
        })
    })

    test.describe('Pengguna - Update Pengguna', () => {
        test.describe('Tipe Pengguna Web', () => {
            test.beforeEach(async ({ page }) => {
                await runSearchTest(page, 1, penggunaWeb.namaPengguna);
                await tombol.moreOption(penggunaWeb.namaPengguna, 'Edit');
            })

            test('Update Dengan Mengosongkan Semua Field', async () => {
                await inputForm.formInput('Nama Pengguna', '');
                await inputForm.formInput('Nomor Telepon', '');
                await tombol.checkAndClick('Perbarui');
                //Cek
                await notif.notificationCheck();
            })

            test('Update Dengan Mengisi Semua Field', async ({ page }) => {
                await selectField.fieldDropdown('Role', penggunaWebBaru.role);
                await inputForm.formInput('Nama Pengguna', penggunaWebBaru.namaPengguna);
                await inputForm.formInput('Nomor Telepon', penggunaWebBaru.noTelpon);
                await tombol.checkAndClick('Perbarui');
                //Cek
                await url.checkUrl('https://mytask-staging.transtrack.id/users');
                await notif.notificationCheck();
                await runSearchTest(page, 1, penggunaWebBaru.namaPengguna);
                await tombol.moreOption(penggunaWebBaru.namaPengguna, 'Detail');
                await detailData.detailCheckData('WEB');
                await detailData.detailCheckData(penggunaWebBaru.role);
                await detailData.detailCheckData(penggunaWebBaru.namaPengguna);
                await detailData.detailCheckData(penggunaWebBaru.noTelpon);
            })
        })

        test.describe('Tipe Pengguna Mobile', () => {
            test.beforeEach(async ({ page }) => {
                await runSearchTest(page, 1, penggunaMobile.namaPengguna);
                await tombol.moreOption(penggunaMobile.namaPengguna, 'Edit');
            })

            test('Update Dengan Mengosongkan Semua Field', async () => {
                await inputForm.formInput('Nama Pengguna', '');
                await inputForm.formInput('Nomor Telepon', '');
                await tombol.checkAndClick('Perbarui');
                //Cek
                await notif.notificationCheck();
            })

            test('Update Dengan Mengisi Semua Field', async ({ page }) => {
                await inputForm.formInput('Nama Pengguna', penggunaMobileBaru.namaPengguna);
                await inputForm.formInput('Nomor Telepon', penggunaMobileBaru.noTelpon);
                await tombol.checkAndClick('Perbarui');
                //Cek
                await url.checkUrl('https://mytask-staging.transtrack.id/users');
                await notif.notificationCheck();
                await runSearchTest(page, 1, penggunaMobileBaru.namaPengguna);
                await tombol.moreOption(penggunaMobileBaru.namaPengguna, 'Detail');
                await detailData.detailCheckData('MOBILE');
                await detailData.detailCheckData(penggunaMobileBaru.namaPengguna);
                await detailData.detailCheckData(penggunaMobileBaru.noTelpon);
            })
        })
    })

    test.describe('Pengguna - Delete Pengguna', () => {
        test.beforeEach(async ({ page }) => {
            await runSearchTest(page, 1, penggunaWebBaru.namaPengguna);
            await tombol.moreOption(penggunaWebBaru.namaPengguna, 'Hapus');
        })

        test('Passwrod Validation - Input Password Yang Salah', async() => {
            await havePopup.popupDelete('Ya');
            await havePopup.popupConfirmDelete('Password@', 'Hapus');
        })

        test('Password Validation - Input Kosong', async() =>{
            await havePopup.popupDelete('Ya');
            await havePopup.popupConfirmDelete('', 'Hapus');
        })

        test('Konfirmasi Delete Pengguna', async({ page }) =>{
            await havePopup.popupDelete('Ya');
            await havePopup.popupConfirmDelete('Password123@', 'Hapus');
            await runSearchTest(page, 1, penggunaWebBaru.namaPengguna);
        })
    })
})