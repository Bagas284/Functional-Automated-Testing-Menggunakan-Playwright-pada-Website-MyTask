import test from "@playwright/test";
import { navigateUrl } from "../pages/Navigate/navigateUrl";
import { menuSidebar } from "../pages/Navigate/menuSidebar";
import { button } from "../pages/Button/button";
import { form } from "../pages/Form/form";
import { notifikasi } from "../pages/Notifikasi/notifikasi";
import { search } from "../pages/Search/search";

test.use({ storageState: 'user.json' });
test.describe('Manajemen Role', () => {
    let url, sidebar, tombol, inputForm, notif;

    const namaTipeTugas = 'Tipe A';
    const kode = 'T01';
    const informasi = 'Informasi A';

    const namaTipeTugasBaru = 'Tipe B';
    const kodeBaru = 'T02';
    const informasiBaru = 'Informasi B';

    const runSearchTest = async (page, column, keyword) => {
        const inputSearch = new search(page, column);
        await inputSearch.search(keyword);
    }

        test.beforeEach(async ({ page }) => {
            url = new navigateUrl(page);
            sidebar = new menuSidebar(page);
            tombol = new button(page);
            inputForm = new form(page);
            notif = new notifikasi(page);

            await url.navigate('https://mytask-staging.transtrack.id/dashboard');
            await url.checkUrl('https://mytask-staging.transtrack.id/dashboard')

            //Klik Menu Role
            await sidebar.clickSidebar('#menuTaskType', 0);
            await url.checkUrl('https://mytask-staging.transtrack.id/task-types');
        })

        test.describe('Tipe Penugasan - Tambah Tipe Penugasan', () => {
            test.beforeEach(async () => {
                await tombol.checkAndClick('Tambah Tipe Tugas');
                await url.checkUrl('https://mytask-staging.transtrack.id/task-types/create');
            })
            test('Tambah Tipe Penugasan Dengan Mengisi Semua Field', async ({ page }) => {
                await inputForm.formInput('Nama Tipe Penugasan', namaTipeTugas);
                await inputForm.formInput('Kode Tipe Penugasan', kode);
                await inputForm.formInput('Informasi', informasi);
                await tombol.checkAndClick('Buat Tipe Tugas');
                //Cek
                await url.checkUrl('https://mytask-staging.transtrack.id/task-types');
                await notif.notificationCheck();
                await runSearchTest(page, 2, namaTipeTugas);
            })
            test('Tambah Tipe Penugasan Dengan Mengosongkan Field', async () => {
                await inputForm.formInput('Nama Tipe Penugasan', '');
                await inputForm.formInput('Kode Tipe Penugasan', '');
                await inputForm.formInput('Informasi', informasi);
                await tombol.checkAndClick('Buat Tipe Tugas');
                //Cek
                await url.checkUrl('https://mytask-staging.transtrack.id/task-types/create');
                await notif.notificationCheck();
            })
        })

        test.describe('Tipe Penugasan - Search', () => {
            test('Search Tipe Penugasan Tidak Terdata', async ({ page }) => {
                await runSearchTest(page, 2, "Tipe B");
            })
            test('Search Tipe Penugasan Terdata', async ({ page }) => {
                await runSearchTest(page, 2, "Tipe A");
            })
        })

        test.describe('Tipe Penugasan - Update', () => {
            test.beforeEach(async ({ page }) => {
                await runSearchTest(page, 2, namaTipeTugas);
                await tombol.moreOption(namaTipeTugas, 'Update');
                await page.waitForTimeout(1000);
            })

            test('Ubah Tipe Penugasan dengan Mengosongkan Field', async () => {
                await inputForm.formInput('Nama Tipe Penugasan', '');
                await inputForm.formInput('Kode Tipe Penugasan', '');
                await inputForm.formInput('Informasi', '');
                await tombol.checkAndClick('Rubah Tipe Tugas');
                await notif.notificationCheck();
            })

            test('Ubah Tipe Penugasan dengan Mengisi Semua Field', async ({page}) => {
                await inputForm.formInput('Nama Tipe Penugasan', namaTipeTugasBaru);
                await inputForm.formInput('Kode Tipe Penugasan', kodeBaru);
                await inputForm.formInput('Informasi', informasiBaru);
                await tombol.checkAndClick('Rubah Tipe Tugas');
                await notif.notificationCheck();
                await runSearchTest(page, 2, namaTipeTugasBaru);
            })
        })
})