import test from "@playwright/test";
import { navigateUrl } from "../pages/Navigate/navigateUrl";
import { menuSidebar } from "../pages/Navigate/menuSidebar";
import { search } from "../pages/Search/search";
import { button } from "../pages/Button/button";
import { form } from "../pages/Form/form";
import { notifikasi } from '../pages/Notifikasi/notifikasi';
import { checkboxRole } from "../pages/Form/checkboxRole";
import { checkData } from "../pages/Cek Data/checkData";

test.use({ storageState: 'user.json' });
test.describe('Manajemen Role', () => {
    let url, sidebar, tombol, inputForm, notif, role, detailData;

    const namaRole = 'Pengawas';
    const deskripsi = 'Role untuk pengawas';

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
            role = new checkboxRole(page);
            detailData = new checkData(page)

            await url.navigate('https://mytask-staging.transtrack.id/dashboard');
            await url.checkUrl('https://mytask-staging.transtrack.id/dashboard')

            //Klik Menu Role
            await sidebar.clickSidebar('#menuRoles');
            await url.checkUrl('https://mytask-staging.transtrack.id/roles');
        })

        test.describe('Manajemen Role - Search', () => {
            test('Search Role Terdata', async ({ page }) => {
                await runSearchTest(page, 2, "Supervisor");
            })

            test('Search Role Tidak Terdata', async ({ page }) => {
                await runSearchTest(page, 2, "Pegawai");
            })
        })

        test.describe('Manajemen Role - Tambah Role', () => {
            test.beforeEach(async () => {
                await tombol.checkAndClick('Tambah Role');
                await url.checkUrl('https://mytask-staging.transtrack.id/roles/create');
            })

            test('Tambah Role dengan Mengisi Semua Field', async ({ page }) => {
                await inputForm.formInput('Nama Role', namaRole);
                await inputForm.formInput('Deskripsi', deskripsi);
                await role.selectRole({
                    feature: ['Fitur'],
                    // role: ['Dashboard'],
                    // action: ['View']
                });
                await tombol.checkAndClick('Tambah');
                //Cek
                await url.checkUrl('https://mytask-staging.transtrack.id/roles');
                await notif.notificationCheck();
                await runSearchTest(page, 2, namaRole);
            })

            test('Tambah Role dengan Mengosongkan Field', async () => {
                await inputForm.formInput('Nama Role');
                await inputForm.formInput('Deskripsi');
                await role.selectRole({
                    feature: []
                });
                await tombol.checkAndClick('Tambah');
                //Cek
                await url.checkUrl('https://mytask-staging.transtrack.id/roles/create');
                await notif.notificationCheck();
            })
        })

        test.describe('Manajemen Role - Detail Role', () => {
            test.beforeEach(async ({ page }) => {
                await runSearchTest(page, 2, namaRole);
            })

            test('Manajemen Role - Kesesuaian Data', async () => {
                await tombol.moreOption(namaRole, 'Detail');
                await detailData.detailCheckData(namaRole);
                await detailData.detailCheckData(deskripsi);
                await detailData.dataCheckbox();
            })
        })
})