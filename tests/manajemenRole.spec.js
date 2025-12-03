import test from "@playwright/test";
import { formLogin } from "../pages/login/formLogin";
import { sidebar } from "../pages/sidebar";
import { search } from "../pages/search/search";
import { button } from "../pages/button";
import { notifikasi } from "../pages/notifikasi/notifikasi";
import { checkboxRole } from "../pages/Form/checkboxRole";
import { form } from "../pages/Form/form";
import { popup } from "../pages/Form/popup";
import { detail } from "../pages/check data/detail";

test.use({ storageState: 'user.json' });
test.describe('Manajemen Role', () => {
    let login, sidebarClick, buttonAction, inputTeks, clickRole, notif, popupDelete, detailPage;

    const runSearchTest = async (page, column, keyword) => {
        const inputSearch = new search(page, column);
        await inputSearch.search(keyword);
        await inputSearch.checkSearch();
    }

    test.beforeEach(async ({ page }) => {
        login = new formLogin(page);
        sidebarClick = new sidebar(page);
        buttonAction = new button(page);
        inputTeks = new form(page);
        clickRole = new checkboxRole(page);
        notif = new notifikasi(page);
        popupDelete = new popup(page);
        detailPage = new detail(page);

        await login.navigate('https://hse-staging.transtrack.id/dashboard');
        await login.checkUrl('https://hse-staging.transtrack.id/dashboard');

        //Masuk menu role
        await sidebarClick.clickSidebar('#menuRoles');
        await login.checkUrl('https://hse-staging.transtrack.id/roles');
    })

    test.describe('Manajemen Role - Search', () => {
        test('Search By Nama Perusahaan - Search Nama Perusahaan Terdata', async ({ page }) => {
            await runSearchTest(page, 1, "PT. OIL MINE INDONESIA");
        })

        test('Search Tidak Terdata', async ({ page }) => {
            await runSearchTest(page, 1, "PT. INDONESIA");
        })

        test('Search By Role - Search Role Terdata', async ({ page }) => {
            await runSearchTest(page, 2, "supervisor");
        })

        test('Empty Search', async ({ page }) => {
            await runSearchTest(page, 2, "");
        })
    })

    test.describe('Manajemen Role - Tambah Role', () => {
        test.beforeEach(async ({ page }) => {
            await buttonAction.checkAndClick('Tambah Role');
            await login.checkUrl('https://hse-staging.transtrack.id/roles/create');
        })

        test('Batal', async ({ page }) => {
            await buttonAction.checkAndClick('Kembali')
            //Check
            await login.checkUrl('https://hse-staging.transtrack.id/roles');
        })

        test('Input Semua', async ({ page }) => {
            const x = 'Kurir Paket'

            //Input Nama Role
            await inputTeks.formInput('Nama Role', x);
            //Input Deskripsi
            await inputTeks.formInput('Ex:  Untuk mengatur user', 'testingtesting');
            await clickRole.selectRole(['Fitur']);
            await buttonAction.checkAndClick('Tambah');

            //Check
            login.checkUrl('https://hse-staging.transtrack.id/roles');
            await notif.notificationCheck('Role berhasil dibuat')

            await runSearchTest(page, 2, x);
        })

        test('Kosongkan Nama Role', async ({ page }) => {
            //Input Nama Role
            await inputTeks.formInput('Nama Role', '');
            //Input Deskripsi
            await inputTeks.formInput('Ex:  Untuk mengatur user', 'testingtesting');

            await clickRole.selectRole(['Pengguna']);

            await buttonAction.checkAndClick('Tambah');

            //Check
            login.checkUrl('https://hse-staging.transtrack.id/roles/create');
        })

        test('Kosongkan Deskripsi', async ({ page }) => {
            const x = 'Administrator';

            //Input Nama Role
            await inputTeks.formInput('Nama Role', x);
            //Input Deskripsi
            await inputTeks.formInput('Ex:  Untuk mengatur user', '');

            await clickRole.selectRole(['Fitur']);

            await buttonAction.checkAndClick('Tambah');

            //Check
            login.checkUrl('https://hse-staging.transtrack.id/roles');
            await notif.notificationCheck('Role berhasil dibuat')
            
            await runSearchTest(page, 2, x);
        })

        test('Informasi Perizinan Perusahaan - Tidak pilih sama sekali', async ({ page }) => {
            const x = 'testing3';

            //Input Nama Role
            await inputTeks.formInput('Nama Role', x);
            //Input Deskripsi
            await inputTeks.formInput('Ex:  Untuk mengatur user', 'testing');
            await buttonAction.checkAndClick('Tambah');

            //Check
            login.checkUrl('https://hse-staging.transtrack.id/roles/create');
            await notif.notificationCheck('Validation failed')
        })

        test('Informasi Perizinan Perusahaan - Click Checkbox View', async ({ page }) => {
            const x = 'Super'

            //Input Nama Role
            await inputTeks.formInput('Nama Role', x);
            //Input Deskripsi
            await inputTeks.formInput('Ex:  Untuk mengatur user', 'testingtesting');
            await clickRole.selectPermission('Dashboard', 'View')
            await buttonAction.checkAndClick('Tambah');

            //Check
            login.checkUrl('https://hse-staging.transtrack.id/roles');
            await notif.notificationCheck('Role berhasil dibuat')

            await runSearchTest(page, 2, x);      
        })
    })

    test.describe('Manajemen Role - Detail Role', () => {
        const namaRole = 'Kurir1';
        const deskripsiRole = '';

        test.beforeEach(async ({ page }) => {
            // Click tambah role
            await buttonAction.checkAndClick('Tambah Role');
            await login.checkUrl('https://hse-staging.transtrack.id/roles/create');
            //Input Nama Role
            await inputTeks.formInput('Nama Role', namaRole);
            //Input Deskripsi
            await inputTeks.formInput('Ex:  Untuk mengatur user', deskripsiRole);
            await clickRole.selectRole(['Fitur']);
            await buttonAction.checkAndClick('Tambah');

            //Check
            await login.checkUrl('https://hse-staging.transtrack.id/roles');
            await notif.notificationCheck('Role berhasil dibuat')

            await runSearchTest(page, 2, namaRole);
        })

        test('Detail Role - Kesesuaian Data', async({ page }) => {
            const roleName = namaRole;
            const roleDescription = deskripsiRole;

            await buttonAction.moreOption(namaRole, 'Detail');

            await detailPage.detailCheckData(roleName);
            await detailPage.detailCheckData(roleDescription);
            await detailPage.dataCheckbox();
        })
    })

    test.describe('Manajemen Role - Delete Role', () => {
        test('Batal Delete', async ({ page }) => {
            const x = 'Kurir Paket';

            await runSearchTest(page, 2, x);      
            await buttonAction.moreOption(x, 'Hapus');
            await popupDelete.popupConfirmDelete('Batal');
        })

        test('Tidak Ada User - Konfirmasi Delete', async ({ page }) => {
            const x = 'Kurir Paket';

            await runSearchTest(page, 2, x);      
            await buttonAction.moreOption(x, 'Hapus');
            await popupDelete.popupConfirmDelete('Ya');

            await notif.notificationCheck('Role berhasil dihapus');
            await runSearchTest(page, 2, x);      
        })

        test('Terdapat User - Delete Role', async ({ page }) => {
            const x = 'Kurir1';

            await runSearchTest(page, 2, x);      
            await buttonAction.moreOption(x, 'Hapus');
            await popupDelete.popupConfirmDelete('Ya');

            await popupDelete.popupWarningUser();
            await popupDelete.popupPindahPengguna('Pindahkan', 'Administrator');

            //Check
            await runSearchTest(page, 2, x);
        })
    })

    test.describe('Manajemen Role - Update Role', () => {
        test.beforeEach(async ({ page  }) => {
            const x = 'Kurir Bagian 1'
            await runSearchTest(page, 2, x);
            await buttonAction.moreOption(x, 'Edit');
        })

        test('Batal Update', async ({ page }) => {
            await buttonAction.checkAndClick('Batal');
        })

        test('Update Semua', async ({ page }) => {
            const namaRole = 'Kurir Bagian 1';
            const deskripsiRole = 'Untuk kurir 1';

            await page.waitForTimeout(2000);
            await inputTeks.formInput('Nama Role', namaRole);
            await inputTeks.formInput('Ex:  Untuk mengatur user', deskripsiRole);
            await clickRole.uncheckRole(['Fitur']);
            await clickRole.selectRole(['Dashboard']);
            await buttonAction.checkAndClick('Update');

            //Check
            login.checkUrl('https://hse-staging.transtrack.id/roles');
            await notif.notificationCheck('Role berhasil diubah')

            await runSearchTest(page, 2, namaRole);
        })

        test('Kosongkan Nama Role', async ({ page }) => {
            const namaRole = '';
            const deskripsiRole = 'Untuk kurir';

            await page.waitForTimeout(2000);
            await inputTeks.formInput('Nama Role', namaRole);
            await inputTeks.formInput('Ex:  Untuk mengatur user', deskripsiRole);
            await clickRole.uncheckRole(['Fitur']);
            await clickRole.selectRole(['Dashboard']);
            await buttonAction.checkAndClick('Update');
        })

        test('Informasi Perizinan Perusahaan - Kosongkan Fitur Ketika Update', async ({ page }) => {
            const namaRole = 'Administrator';
            const deskripsiRole = 'Untuk admin';

            await page.waitForTimeout(2000);
            await inputTeks.formInput('Nama Role', namaRole);
            await inputTeks.formInput('Ex:  Untuk mengatur user', deskripsiRole);
            await clickRole.uncheckRole(['Dashboard']);
            await buttonAction.checkAndClick('Update');

            //Check
            await notif.notificationCheck('Bad Request')
        })
    })
})