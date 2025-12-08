import test from "@playwright/test";
import { formLogin } from "../pages/login/formLogin";
import { sidebar } from "../pages/sidebar";
import { search } from "../pages/search/search";
import { filter } from "../pages/filter/filter";
import { button } from "../pages/button";
import { radioButton } from "../pages/Form/radioButton";
import { notifikasi } from "../pages/notifikasi/notifikasi";
import { dropdown } from "../pages/Form/dropdown";
import { form } from "../pages/Form/form";
import { detail } from "../pages/check data/detail";

test.use({ storageState: 'user.json' });
test.describe('Pengguna', () => {
    let login, sidebarClick, filterOpsi, buttonAction, rbTipePengguna,notif, inputRole, inputForm, detailPage;

    test.beforeEach(async ({ page }) => {
            login = new formLogin(page);
            sidebarClick = new sidebar(page);
            filterOpsi = new filter(page);
            buttonAction = new button(page);
            rbTipePengguna = new radioButton(page);
            notif = new notifikasi(page);
            inputRole = new dropdown(page);
            inputForm = new form(page);
            detailPage = new detail(page);
        
            await login.navigate('https://hse-staging.transtrack.id/dashboard');
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
            await filterOpsi.filterOption();
            await filterOpsi.filterDateRange(
                '2025', 'Oct', '20',
                '2025', 'Oct', '23'
            );
            await buttonAction.checkAndClick('Terapkan Filter');
            await runSearchTest(page, 1, "Bagas Intern QA");
        })

        test('Search By Nama Pengguna - Search Nama Pengguna Setelah Melakukan Filter Role', async ({ page }) => {
            await filterOpsi.filterOption();
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

    test.describe('Pengguna - Tambah Pengguna', () => {
        const runSearchTest = async (page, column, keyword) => {
            const inputSearch = new search(page, column);
            await inputSearch.search(keyword);
            await inputSearch.checkSearch();
        }

        //Pengguna web
        const tipePenggunaWeb = 'Web User';
        const role = 'Supervisor';
        const namaPenggunaWeb = 'Bagas Aldianata Web';
        const emailWeb = 'bagasaldianatawebsite1@transtrack.id';
        const nomorTeleponWeb = '082141676046';
        const passwordWeb = 'Password123@';

        //Pengguna mob
        const tipePenggunaMobile = 'Mobile User';
        const namaPenggunaMob = 'Bagas Aldianata Mob';
        const emailMob = 'bagasaldianatamobile1@transtrack.id';
        const nomorTeleponMob = '082141676046';
        const pin = '123456';

        test.beforeEach(async ({ page }) => {
            await buttonAction.checkAndClick('Tambah');
            await login.checkUrl('https://hse-staging.transtrack.id/users/create');
        })

        test('Batal', async ({ page }) => {
            await buttonAction.checkAndClick('Batal')
            //Check
            await login.checkUrl('https://hse-staging.transtrack.id/users');
        })

        test('Input Hanya Tipe Pengguna', async ({ page }) => {
            await rbTipePengguna.selectRadioButton('Web User');
            await buttonAction.checkAndClick('Simpan');
            //Check
            await notif.notificationCheck('Password/PIN harus diisi');
            await login.checkUrl('https://hse-staging.transtrack.id/users/create');
        })

        test.describe('Tipe Pengguna Web', () => {
             test('Kosongkan Role', async ({ page }) => {
                await rbTipePengguna.selectRadioButton(tipePenggunaWeb);
                await inputForm.formInput('Nama Pengguna', namaPenggunaWeb);
                await inputForm.formInput('Email', emailWeb);
                await inputForm.formInput('Nomor Telepon', nomorTeleponWeb);
                await inputForm.formInput('Kata Sandi', passwordWeb);
                await buttonAction.checkAndClick('Simpan');
                //Check
                await notif.notificationCheck('role is required');
                await notif.notificationCheck('Gagal menambahkan pengguna');
                await login.checkUrl('https://hse-staging.transtrack.id/users/create');
            })

            test('Kosongkan Nama Pengguna', async ({ page }) => {
                await rbTipePengguna.selectRadioButton(tipePenggunaWeb);
                await inputRole.selectDropdown(role);
                await inputForm.formInput('Email', emailWeb);
                await inputForm.formInput('Nomor Telepon', nomorTeleponWeb);
                await inputForm.formInput('Kata Sandi', passwordWeb);
                await buttonAction.checkAndClick('Simpan');
                //Check
                await notif.notificationCheck('Gagal menambahkan pengguna');
                await login.checkUrl('https://hse-staging.transtrack.id/users/create');
            })

            test('Kosongkan Email', async ({ page }) => {
                await rbTipePengguna.selectRadioButton(tipePenggunaWeb);
                await inputRole.selectDropdown(role);
                await inputForm.formInput('Nama Pengguna', namaPenggunaWeb);
                await inputForm.formInput('Nomor Telepon', nomorTeleponWeb);
                await inputForm.formInput('Kata Sandi', passwordWeb);
                await buttonAction.checkAndClick('Simpan');
                //Check
                await notif.notificationCheck('Gagal menambahkan pengguna');
                await login.checkUrl('https://hse-staging.transtrack.id/users/create');
            })

             test('Kosongkan Nomor Telepon', async ({ page }) => {
                await rbTipePengguna.selectRadioButton(tipePenggunaWeb);
                await inputRole.selectDropdown(role);
                await inputForm.formInput('Nama Pengguna', namaPenggunaWeb);
                await inputForm.formInput('Email', emailWeb);
                await inputForm.formInput('Kata Sandi', passwordWeb);
                await buttonAction.checkAndClick('Simpan');
                //Check
                await notif.notificationCheck('Gagal menambahkan pengguna');
                await login.checkUrl('https://hse-staging.transtrack.id/users/create');
            })

            test('Kosongkan Kata Sandi', async ({ page }) => {
                await rbTipePengguna.selectRadioButton(tipePenggunaWeb);
                await inputRole.selectDropdown(role);
                await inputForm.formInput('Nama Pengguna', namaPenggunaWeb);
                await inputForm.formInput('Email', emailWeb);
                await inputForm.formInput('Nomor Telepon', nomorTeleponWeb);
                await buttonAction.checkAndClick('Simpan');
                //Check
                await notif.notificationCheck('Password/PIN harus diisi');
                await login.checkUrl('https://hse-staging.transtrack.id/users/create');
            })

            test('Input Semua', async ({ page }) => {
                await rbTipePengguna.selectRadioButton(tipePenggunaWeb);
                await inputRole.selectDropdown(role);
                await inputForm.formInput('Nama Pengguna', namaPenggunaWeb);
                await inputForm.formInput('Email', emailWeb);
                await inputForm.formInput('Nomor Telepon', nomorTeleponWeb);
                await inputForm.formInput('Kata Sandi', passwordWeb);
                await buttonAction.checkAndClick('Simpan');
                //Check
                await notif.notificationCheck('Pengguna berhasil ditambahkan');
                await login.checkUrl('https://hse-staging.transtrack.id/users');
                await runSearchTest(page, 1, namaPenggunaWeb);
            })
        })

        test.describe('Tipe Pengguna Mobile', () => {
            test('Kosongkan Nama Pengguna', async ({ page }) => {
                await rbTipePengguna.selectRadioButton(tipePenggunaMobile);
                await inputForm.formInput('Email', emailMob);
                await inputForm.formInput('Nomor Telepon', nomorTeleponMob);
                await inputForm.formInput('PIN Akun', pin);
                await buttonAction.checkAndClick('Simpan');
                //Check
                await notif.notificationCheck('Gagal menambahkan pengguna');
                await login.checkUrl('https://hse-staging.transtrack.id/users/create');
            })

            test('Kosongkan Email', async ({ page }) => {
                await rbTipePengguna.selectRadioButton(tipePenggunaMobile);
                await inputForm.formInput('Nama Pengguna', namaPenggunaMob);
                await inputForm.formInput('Nomor Telepon', nomorTeleponMob);
                await inputForm.formInput('PIN Akun', pin);
                await buttonAction.checkAndClick('Simpan');
                //Check
                await notif.notificationCheck('Gagal menambahkan pengguna');
                await login.checkUrl('https://hse-staging.transtrack.id/users/create');
            })

            test('Kosongkan Nomor Telepon', async ({ page }) => {
                await rbTipePengguna.selectRadioButton(tipePenggunaMobile);
                await inputForm.formInput('Nama Pengguna', namaPenggunaMob);
                await inputForm.formInput('Email', emailMob);
                await inputForm.formInput('PIN Akun', pin);
                await buttonAction.checkAndClick('Simpan');
                //Check
                await notif.notificationCheck('Gagal menambahkan pengguna');
                await login.checkUrl('https://hse-staging.transtrack.id/users/create');
            })

            test('Kosongkan PIN Akun', async ({ page }) => {
                await rbTipePengguna.selectRadioButton(tipePenggunaMobile);
                await inputForm.formInput('Nama Pengguna', namaPenggunaMob);
                await inputForm.formInput('Email', emailMob);
                await inputForm.formInput('Nomor Telepon', nomorTeleponMob);
                await buttonAction.checkAndClick('Simpan');
                //Check
                await notif.notificationCheck('Password/PIN harus diisi');
                await login.checkUrl('https://hse-staging.transtrack.id/users/create');
            })

            test('Input Semua', async ({ page }) => {
                await rbTipePengguna.selectRadioButton(tipePenggunaMobile);
                await inputForm.formInput('Nama Pengguna', namaPenggunaMob);
                await inputForm.formInput('Email', emailMob);
                await inputForm.formInput('Nomor Telepon', nomorTeleponMob);
                await inputForm.formInput('PIN Akun', pin);
                await buttonAction.checkAndClick('Simpan');
                //Check
                await notif.notificationCheck('Pengguna berhasil ditambahkan');
                await login.checkUrl('https://hse-staging.transtrack.id/users');
                await runSearchTest(page, 1, namaPenggunaMob);
            })
        })
    })

    test.describe('Pengguna - Detail Pengguna', () => {
        const runSearchTest = async (page, column, keyword) => {
            const inputSearch = new search(page, column);
            await inputSearch.search(keyword);
            await inputSearch.checkSearch();
        }

        const tipePenggunaWeb = 'Web User';
        const role = 'Supervisor';
        const namaPenggunaWeb = 'Bagas Website';
        const emailWeb = 'bagasweb@transtrack.id';
        const nomorTeleponWeb = '082141676046';
        const passwordWeb = 'Password123@';

        test.beforeEach(async ({ page }) => {
            // Tambah pengguna
            await buttonAction.checkAndClick('Tambah');
            await login.checkUrl('https://hse-staging.transtrack.id/users/create');
            await rbTipePengguna.selectRadioButton(tipePenggunaWeb);
            await inputRole.selectDropdown(role);
            await inputForm.formInput('Nama Pengguna', namaPenggunaWeb);
            await inputForm.formInput('Email', emailWeb);
            await inputForm.formInput('Nomor Telepon', nomorTeleponWeb);
            await inputForm.formInput('Kata Sandi', passwordWeb);
            await buttonAction.checkAndClick('Simpan');
        
            //Check
            await notif.notificationCheck('Pengguna berhasil ditambahkan');
            await login.checkUrl('https://hse-staging.transtrack.id/users');
            await runSearchTest(page, 1, namaPenggunaWeb);
        })

        test('Detail Role - Kesesuaian Data', async({ page }) => {
            await buttonAction.moreOption(namaPenggunaWeb, 'Detail');

            //Check
            await detailPage.detailCheckData(role);
            await detailPage.detailCheckData(namaPenggunaWeb);
            await detailPage.detailCheckData(emailWeb);
            await detailPage.detailCheckData(nomorTeleponWeb);
        })
    })
})