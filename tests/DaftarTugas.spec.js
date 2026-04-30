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
import { checkData } from "../pages/Cek Data/checkData";
import { beforeEach } from "node:test";

test.use({ storageState: 'user.json' });
test.describe('Daftar Tugas', () => {
    let url, sidebar, sortir, tombol, selectField, inputForm, selectDeadline, tipePengerjaan, tambahLokasi, notif, detailData;

    const formDaftarTugas = {
        tipePenugasan: 'Pengambilan Hasil Tambang',
        judulPenugasan: 'Pengiriman Hasil Tambang',
        namaKaryawan1: 'Bagas Aldinata Mobile',
        deskripsiPenugasan: 'Mengirim Hasil Tambang ke sektor A',
        noReferensi: '001',
        lokasiAwal: 'Transtrack Bandung',
        lokasiTujuan: ['Telkom University'],
        radioButton: 'Bebas'
    }

    const formDaftarTugasBaru = {
        tipePenugasanBaru: 'Tipe B',
        judulPenugasanBaru: 'Pencatatan Hasil Tambang',
        deskripsiPenugasanBaru: 'Tugas mencatat hasil tambang',
        noReferensiBaru: '01',
        lokasiAwalBaru: 'Telkom University',
        lokasiTujuanBaru1: 'Sukabirus, Bandung',
        radioButtonBaru: 'Tersusun'
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
        detailData = new checkData(page);

        await url.navigate('https://mytask-staging.transtrack.id/dashboard');
        await url.checkUrl('https://mytask-staging.transtrack.id/dashboard')

        //Klik Menu Daftar Tugas
        await sidebar.clickSidebar('#menuTasks');
        await url.checkUrl('https://mytask-staging.transtrack.id/tasks');
    })

        test.describe('Daftar Tugas - Search', () => {
            test('Search Daftar Tugas Terdata', async ({ page }) => {
                await runSearchTest(page, 1, "Pengumpulan Hasil Tambang");
            })

            test('Search Daftar Tugas Tidak Terdata', async ({ page }) => {
                await runSearchTest(page, 1, 'Pemasangan WIFI');
            })
        })

        test.describe('Daftar Tugas - Filter', () => {
            test.beforeEach(async () => {
                await sortir.filterOption();               
            })
            test('Select Karyawan', async ({ page }) => {
                await sortir.filterDropdown('Karyawan', 'Bagas Aldinata Mobile');
                await tombol.checkAndClick('Terapkan Filter');
                await page.mouse.click(50, 50);
                await runFIlterTest(page, 1);
            })

            test('Select Status', async ({ page }) => {
                await sortir.filterStatus(['Dalam Antrian']);
                await tombol.checkAndClick('Terapkan Filter');
                await page.mouse.click(50, 50);
                await runFIlterTest(page, 1);
            })

            test('Date Range', async ({ page }) => {
                await sortir.filterDateRange(
                    'start',
                    '2026', 'Mar', '29'
                );
                await sortir.filterDateRange(
                    'end',
                    '2026', 'Mar', '31'
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
                //Cek
                await url.checkUrl('https://mytask-staging.transtrack.id/tasks/create');
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
                await selectField.fieldDropdown('Karyawan', formDaftarTugas.namaKaryawan1);
                await selectDeadline.tenggatWaktu('2026', 'May', '25');
                await inputForm.formInput('Deskripsi Penugasan', formDaftarTugas.deskripsiPenugasan);
                await inputForm.formInput ('No Referensi', formDaftarTugas.noReferensi);
                await tipePengerjaan.selectRadioButton(formDaftarTugas.radioButton);
                // Add lokasi awal
                await tambahLokasi.lokasiAwal(formDaftarTugas.lokasiAwal, 'Simpan');
                // Add lokasi tujuan
                await tambahLokasi.lokasiTujuan(formDaftarTugas.lokasiTujuan, 'Simpan');
                await tombol.checkAndClick('Buat Tugas')
                //Cek
                await url.checkUrl('https://mytask-staging.transtrack.id/tasks');
                await notif.notificationCheck();
                await runSearchTest(page, 1, formDaftarTugas.judulPenugasan);
            })
        })

        test.describe('Daftar Tugas - Detail Tugas', () => {
            test('Detail Tugas - Kesesuaian Data ', async ({ page }) => {
                await runSearchTest(page, 1, formDaftarTugas.judulPenugasan);
                await tombol.checkAndClick('Detail');
                await detailData.detailCheckDataField('Tipe Penugasan', formDaftarTugas.tipePenugasan);
                await detailData.detailCheckDataField('Judul Penugasan', formDaftarTugas.judulPenugasan);
                await detailData.detailCheckDataField('pilih karyawan', formDaftarTugas.namaKaryawan1);
                await detailData.detailCheckDataField('Tenggat Waktu', '2026-05-25', {exact: true});
                await detailData.detailCheckData(formDaftarTugas.lokasiAwal);
                await detailData.detailCheckData('TransTRACK.ID Bandung, 24, Jalan Emong, Burangrang, Lengkong, Bandung, Jawa Barat, Jawa, 40262, Indonesia');
                await detailData.detailCheckData('Telkom University');
                await detailData.detailCheckData('Telkom University, 1, Jalan Sukabirus, Citeureup, Bandung, Jawa Barat, Jawa, 40257, Indonesia');
                await detailData.detailCheckDataField('Deskripsi Penugasan', formDaftarTugas.deskripsiPenugasan);
                await detailData.detailCheckDataField('No Referensi', formDaftarTugas.noReferensi);
                await detailData.checkRadioButton(formDaftarTugas.radioButton);
            })
        })

        test.describe('Daftar Tugas - Update Tugas', () => {
            test.beforeEach(async ({ page }) => {
                await runSearchTest(page, 1, formDaftarTugas.judulPenugasan);
                await tombol.checkAndClick('Detail');
                await tombol.checkAndClick('Edit');
            })
            
            test('Update Dengan Mengosongkan Semua Field', async () =>{
                await selectField.fieldDropdown('Tipe Penugasan', '');
                await inputForm.formInput('Judul Penugasan', '');
                await selectField.fieldDropdown('Karyawan', '');
                await inputForm.formInput('Deskripsi Penugasan', '');
                await inputForm.formInput ('No Referensi', '');
                await tombol.checkAndClick('Update');
                await notif.notificationCheck();
            })

            test('Update Dengan Mengisi Semua Field', async() =>{
                await selectField.fieldDropdown('Tipe Penugasan', formDaftarTugasBaru.tipePenugasanBaru);
                await inputForm.formInput('Judul Penugasan', formDaftarTugasBaru.judulPenugasanBaru);
                await selectDeadline.tenggatWaktu('2026', 'May', '30');
                await tambahLokasi.editLokasiAwal(formDaftarTugasBaru.lokasiAwalBaru, 'Simpan');
                await inputForm.formInput('Deskripsi Penugasan', formDaftarTugasBaru.deskripsiPenugasanBaru);
                await inputForm.formInput ('No Referensi', formDaftarTugasBaru.noReferensiBaru);
                await tipePengerjaan.selectRadioButton(formDaftarTugasBaru.radioButtonBaru);
                await tambahLokasi.editLokasiTujuan(0, formDaftarTugasBaru.lokasiTujuanBaru1, 'Simpan');
                await tombol.checkAndClick('Update');
            })
        })
})