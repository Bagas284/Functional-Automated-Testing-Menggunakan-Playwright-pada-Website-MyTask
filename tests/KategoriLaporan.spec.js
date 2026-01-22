import { test } from "@playwright/test";
import { navigateUrl } from "../pages/Navigate/navigateUrl";
import { menuSidebar } from "../pages/Navigate/menuSidebar";
import { search } from "../pages/Search/search";
import { button } from "../pages/Button/button";
import { form } from "../pages/Form/form";
import { notifikasi } from "../pages/Notifikasi/notifikasi";
import { messageError } from "../pages/Notifikasi/messageError";
import { popup } from "../pages/Notifikasi/popup";
import { checkData } from "../pages/Cek Data/checkData";

test.use({ storageState: 'user.json' });
test.describe('Kategori Laporan', () => {
    let url, sidebar, tombol, inputForm, notif, errorMessage, havePopup, detailData;

    const namaKategori = 'Inspeksi Alat Berat';
    const deskripsi = 'Untuk inspeksi alat berat';
    const teksPendek = 'Nama Alat Berat';
    const teksPanjang = 'Keterangan Alat Berat';
    const pilihanTunggal = 'Kondisi Alat Berat';
    const pilihanBeberapa = 'Kualitas Pekerja';
    const lokasi = 'Lokasi Alat Berat';
    const file = 'File Pendukung';
    const ttd = 'Tanda Tangan';

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
            errorMessage = new messageError(page);
            havePopup = new popup(page);
            detailData = new checkData(page)

            await url.navigate('https://mytask-staging.transtrack.id/dashboard');
            await url.checkUrl('https://mytask-staging.transtrack.id/dashboard')

            //Klik Menu Kategori Laporan
            await sidebar.clickSidebar('#menuTaskType', 1);
            await url.checkUrl('https://mytask-staging.transtrack.id/report-category');
        })

        test.describe('Kategori Laporan - Search', () => {
            test('Search Nama Laporan Terdata', async ({ page }) => {
                await runSearchTest(page, 2, "Inspeksi Hasil Tambang");
            })

            test('Search Nama Laporan Tidak Terdata', async ({ page }) => {
                await runSearchTest(page, 2, 'Inspeksi Karyawan');
            })
        })

        test.describe('Kategori Laporan - Tambah Kategori', () => {
            test.beforeEach(async () => {
                await tombol.checkAndClick('Tambah Kategori');
                await url.checkUrl('https://mytask-staging.transtrack.id/report-category/create');
            })

            test('Input dengan Mengosongkan Filed', async () => {
                await inputForm.formInput('Nama Kategori', '');
                await inputForm.formInput('Deskripsi Kategori', '');
                await inputForm.formInput('Judul', '');
                await tombol.checkAndClick('Submit');
                //Cek
                await url.checkUrl('https://mytask-staging.transtrack.id/report-category/create');
                await errorMessage.textError();
                await notif.notificationCheck();
            })

            test('Tidak Ada Daftar Input Laporan Sama Sekali', async () => {
                await inputForm.formInput('Nama Kategori', namaKategori);
                await inputForm.formInput('Deskripsi Kategori', deskripsi);
                //Hapus daftar input laporan
                await tombol.checkAndClick('Hapus Input');
                await havePopup.popupDeleteInput('Delete');
                await tombol.checkAndClick('Submit');
                // //Cek
                await url.checkUrl('https://mytask-staging.transtrack.id/report-category/create');
                await notif.notificationCheck();
            })

            test('Pilihan Tunggal/Beberapa - Input Opsi Lebih Dari 1', async () => {
                await inputForm.tambahInputLaporan([
                    'Pilihan Tunggal'
                ]);
                await inputForm.formInput('Judul', pilihanTunggal, 1);
                await inputForm.inputPilihan(['Tidak Aman', '', 'Aman'], "Tambah");
            })

            test('Pilihan Tunggal/Beberapa - Update Opsi', async () => {
                await inputForm.tambahInputLaporan([
                    'Pilihan Tunggal'
                ]);
                await inputForm.formInput('Judul', pilihanTunggal, 1);
                await inputForm.inputPilihan(['Tidak Aman'], "Tambah");
                await inputForm.inputPilihan(['Terkendala', 'Tidak Terkendala', 'Aman'], "Tambah");
            })

            test('Pilihan Tunggal/Beberapa- Delete Opsi', async () => {
                await inputForm.tambahInputLaporan([
                    'Pilihan Tunggal'
                ]);
                await inputForm.formInput('Judul', pilihanTunggal, 1);
                await inputForm.inputPilihan(['Tidak Aman', 'Cukup', 'Aman'], "Tambah");
                await inputForm.inputPilihan(['Cukup', '', ''], "Tambah");
            })

            test('Input dengan Mengisi Semua Field', async ({ page }) => {
                //Isi Field Nama Kategori dan Deskripsi
                await inputForm.formInput('Nama Kategori', namaKategori);
                await inputForm.formInput('Deskripsi Kategori', deskripsi);
                // Tambahkan Daftar Input Laporan
                await inputForm.tambahInputLaporan([
                        'Teks Panjang', 
                        'Pilihan Tunggal', 
                        'Pilih Beberapa Opsi', 
                        'Location', 
                        'Unggah File',
                        'Tanda Tangan'
                    ]);
                //ISi judul per daftar input laporan
                await inputForm.formInput('Judul', teksPendek, 0);
                await inputForm.formInput('Judul', teksPanjang, 1);
                await inputForm.formInput('Judul', pilihanTunggal, 2);
                await inputForm.formInput('Judul', pilihanBeberapa, 3);
                await inputForm.formInput('Lokasi', lokasi, 0);
                await inputForm.formInput('Upload File', file);
                await inputForm.formInput('Tanda Tangan Bukti', ttd);
                //Toggle
                await tombol.toggleAktif(['Wajib Diisi', 'Keterangan'], 0);
                await tombol.toggleAktif(['Wajib Diisi'], 1);
                await tombol.toggleAktif(['Wajib Diisi', 'Unggah Foto', 'Keterangan'], 2);
                await tombol.checkAndClick('Submit');
                //Cek
                await url.checkUrl('https://mytask-staging.transtrack.id/report-category');
                await notif.notificationCheck();
                await runSearchTest(page, 2, namaKategori);
            })
        })

        test.describe('Kategori Laporan - Detail Kategori', () => {
            test.beforeEach(async ({ page }) => {
                await runSearchTest(page, 2, namaKategori);
                await tombol.moreOption(namaKategori, 'Detail');
            })

            test('Kategori Laporan - Kesesuaian Data', async () => {
                await detailData.detailCheckData(namaKategori);
                await detailData.detailCheckData(deskripsi);
                await detailData.cek([teksPendek, teksPanjang, pilihanTunggal, pilihanBeberapa, lokasi, file, ttd]);
            })
        })
})