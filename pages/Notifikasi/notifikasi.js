import { expect } from "@playwright/test";

export class notifikasi {
    constructor(page){
        this.page = page;
        this.notifData = {
            loginGagal: "Email atau password tidak sesuai"
        };
    }
    async notificationCheck(){
        const notif = this.page.getByTestId('toast-content');
        
        // Ambil teks aktual
        const actualText = (await notif.textContent())?.trim();

        // Bandingkan dengan seluruh data notif yang tersedia
        const isMatch = Object.values(this.notifData).some(expected =>
            actualText.includes(expected)
        );

        if(isMatch){
            console.log(`Muncul pesan notifikasi "${actualText}`);
        }
        expect(
            isMatch,
            `Teks notifikasi "${actualText}" tidak sesuai dengan data notifikasi yang terdaftar`
        ).toBeTruthy();
    }
}