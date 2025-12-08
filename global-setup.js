import { chromium} from '@playwright/test';
import { formLogin } from './pages/login/formLogin';

async function loginAndSave(context, page, username, password, outputFile){
    const login = new formLogin(page);

    await login.navigate('https://hse-staging.transtrack.id/login');

    await login.usernameInput(username);
    await login.passwordInput(password);
    await login.buttonLogin();

    await login.checkUrl('https://hse-staging.transtrack.id/dashboard');
    
    await context.storageState({ path: outputFile });
}

async function globalSetup() {
    const browser = await chromium.launch();

    //Login admin
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();

    await loginAndSave(adminContext, adminPage, 'admin@transtrack.id', 'Password123@', 'admin.json');

    //Login user
    const userContext = await browser.newContext();
    const userPage = await userContext.newPage();

    await loginAndSave(userContext, userPage, 'bagas@transtrack.id', 'Password123@', 'user.json');

    await browser.close();
}

export default globalSetup;