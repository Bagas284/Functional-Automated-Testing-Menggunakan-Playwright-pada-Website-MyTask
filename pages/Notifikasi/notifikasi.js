import { expect } from "@playwright/test";

export class notifikasi {
    constructor(page) {
        this.page = page;
        this.notifData = [
            "Email atau password tidak sesuai",
            "Role berhasil dibuat",
            "Role berhasil diubah",
            "permissions must be at least 1",
            "Role berhasil dihapus",
            "this role has user, please update user role first",
            "Pengguna berhasil dipindahkan ke role yang dituju",
            "Success create task type",
            "Task title field is required",
            "Type identity field is required",
            "Type already exists",
            "Success update task type",
            "Success delete task type",
            "Kategori berhasil dibuat",
            "Judul #1 harus di isi",
            "Minimal harus ada satu input",
            "Kategori berhasil diperbarui",
            "Kategori berhasil dihapus",
            "Berhasil simpan data lokasi asal",
            "Berhasil tambah data lokasi tujuan",
            "Minimal terdapat satu tujuan",
            "Nama lokasi asal wajib diisi",
            "Catatan wajib diisi",
            "Deadline wajib diisi",
            "Judul tugas wajib diisi",
            "Tipe pengerjaan tugas wajib diisi",
            "Tipe task wajib diisi",
            "Karyawan wajib diisi",
            "Success creating task",
            "Success",
            "Berhasil ubah data lokasi tujuan",
            "Pengguna berhasil ditambahkan",
            "role is required",
            "name is required",
            "email is required",
            "phone is required",
            "Gagal menambahkan pengguna",
            "Password/PIN harus diisi",
        ];
    }

    async notificationCheck() {
        try {
            const notifs = this.page.getByTestId('toast-content');

            // Pastikan minimal 1 notifikasi muncul
            await expect(notifs.first()).toBeVisible();

            const notifCount = await notifs.count();

            for (let i = 0; i < notifCount; i++) {
                const notif = notifs.nth(i);
                const actualText = (await notif.textContent())?.trim() || "";

                const isMatch = this.notifData.some(expected =>
                    actualText.includes(expected)
                );

                expect(
                    isMatch,
                    `Teks notifikasi "${actualText}" tidak terdaftar`
                ).toBeTruthy();

                console.log(`✅ [SUCCESS] Notifikasi valid: "${actualText}"`);
            }

        } catch (error) {
            console.log('❌ [FAILED] Gagal melakukan pengecekan notifikasi');
            console.log(`   ↳ Reason: ${error.message}`);
            throw error;
        }
    }
}