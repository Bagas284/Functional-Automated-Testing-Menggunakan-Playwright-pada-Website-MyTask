import { test } from "@playwright/test";
import { menuSidebar } from "../pages/Navigate/menuSidebar";
import { navigateUrl } from "../pages/Navigate/navigateUrl";
import { search } from "../pages/Search/search";
import { filter } from "../pages/Filter/filter";
import { button } from "../pages/Button/button";
import { dropdownSelect } from "../pages/Form/dropdownSelect";
import { form } from "../pages/Form/form";
import { selectDate } from "../pages/Form/selectDate";
import { radioButton } from "../pages/Form/radioButton";
import { addLocation } from "../pages/Form/addLocation";
import { notifikasi } from "../pages/Notifikasi/notifikasi";

test.use({ storageState: 'user.json' });
test.describe('Daftar Tugas', () => {
    let url, sidebar, sortir, tombol, selectField, inputForm, selectDeadline, tipePengerjaan, tambahLokasi, notif;

    const formDaftarTugas = {
        tipePenugasan: 'Tipe A',
        judulPenugasan: 'Pemantauan Alat Berat',
        namaKaryawan1: 'Mobile',
        namaKaryawan2: 'Bagas Mobile',
        deskripsiPenugasan: 'Memantau alat berat',
        noReferensi: '001',
        lokasiAwal: 'Transtrack Bandung',
        lokasiTujuan: ['Telkom University', 'Unpad']
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
        selectField = new dropdownSelect(page);
        inputForm = new form(page);
        selectDeadline = new selectDate(page);
        tipePengerjaan = new radioButton(page);
        tambahLokasi = new addLocation(page);
        notif = new notifikasi(page);

        await url.navigate('https://mytask-staging.transtrack.id/dashboard');
        await url.checkUrl('https://mytask-staging.transtrack.id/dashboard')

        //Klik Menu Daftar Tugas
        await sidebar.clickSidebar('#menuTasks');
        await url.checkUrl('https://mytask-staging.transtrack.id/tasks');
    })

    test.describe('Daftar Tugas - Search', () => {
        test('Search Daftar Tugas Terdata', async ({ page }) => {
            await runSearchTest(page, 1, "Pemasangan Router");
        })

        test('Search Daftar Tugas Tidak Terdata', async ({ page }) => {
            await runSearchTest(page, 1, 'Pemasangan WIFI');
        })
    })

    test.describe('Daftar Tugas - FIlter', () => {
        test.beforeEach(async () => {
            await sortir.filterOption();               
        })
        test('Select Karyawan', async ({ page }) => {
            await sortir.filterDropdown('Karyawan', 'Mobile');
            await tombol.checkAndClick('Terapkan Filter');
            await page.mouse.click(50, 50);
            await runFIlterTest(page, 1);
        })

        test('Select Status', async ({ page }) => {
            await sortir.filterStatus(['Batal']);
            await tombol.checkAndClick('Terapkan Filter');
            await page.mouse.click(50, 50);
            await runFIlterTest(page, 1);
        })

        test('Date Range', async ({ page }) => {
            await sortir.filterDateRange(
                'start',
                '2026', 'Jan', '1'
            );
            await sortir.filterDateRange(
                'end',
                '2026', 'Jan', '2'
            );
            await tombol.checkAndClick('Terapkan Filter');
            await page.mouse.click(50, 50);
            await runFIlterTest(page, 1);
        })
    })

    test.describe('Daftar Tugas - Tambah Tugas', () => {
        test.beforeEach(async () => {
            await tombol.checkAndClick('Tambah Tugas');
            await url.checkUrl('https://mytask-staging.transtrack.id/tasks/create');
        })

        test('Tambah Tugas dengan Mengosongkan Field', async () => {
            await selectField.fieldDropdown('Tipe Penugasan', '');
            await inputForm.formInput('Judul Penugasan', '');
            await selectField.fieldDropdown('Karyawan', '');
            await inputForm.formInput('Deskripsi Penugasan', '');
            await inputForm.formInput ('No Referensi', '');

            await tombol.checkAndClick('Buat Tugas');
            await notif.notificationCheck();
        })

        test('Lokasi Tujuan - Kosongkan Field Nama Tujuan dan Alamat Lengkap', async () => {
            // Add lokasi tujuan
            await tambahLokasi.lokasiTujuan([], 'Simpan');
        })

        test('Lokasi Awal - Kosongkan Field Nama Tujuan dan Alamat Lengkap', async () => {
            // Add lokasi awal
            await tambahLokasi.lokasiAwal('', 'Simpan');
        })

        test('Hapus Lokasi Tujuan', async () => {
            // Add lokasi tujuan
            await tambahLokasi.lokasiTujuan(formDaftarTugas.lokasiTujuan, 'Simpan');
            //Hapus
            await tambahLokasi.hapusLokasiTujuan(0, 'Konfirmasi');
        })
        
        test('Tambah Tugas dengan Mengisi Semua Field', async ({ page }) => {
            await selectField.fieldDropdown('Tipe Penugasan', formDaftarTugas.tipePenugasan);
            await inputForm.formInput('Judul Penugasan', formDaftarTugas.judulPenugasan);
            await selectField.fieldDropdown('Karyawan', formDaftarTugas.namaKaryawan2);
            await selectDeadline.tenggatWaktu('2026', 'Feb', '20');
            await inputForm.formInput('Deskripsi Penugasan', formDaftarTugas.deskripsiPenugasan);
            await inputForm.formInput ('No Referensi', formDaftarTugas.noReferensi);
            await tipePengerjaan.selectRadioButton('Bebas');
            // Add lokasi awal
            await tambahLokasi.lokasiAwal(formDaftarTugas.lokasiAwal, 'Simpan');
            // Add lokasi tujuan
            await tambahLokasi.lokasiTujuan(formDaftarTugas.lokasiTujuan, 'Simpan');
            await tombol.checkAndClick('Buat Tugas')
            //Cek
            await notif.notificationCheck();
            await runSearchTest(page, 1, formDaftarTugas.judulPenugasan);
        })
    })
})