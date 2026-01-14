import { chromium} from '@playwright/test';
import { formLogin } from './pages/Login/formLogin';
import { navigateUrl } from './pages/Navigate/navigateUrl';

async function loginAndSave(context, page, username, password, outputFile) {
    const login = new formLogin(page);
    const url = new navigateUrl(page);

    await url.navigate('https://mytask-staging.transtrack.id/login');

    await login.usernameInput(username);
    await login.passwordInput(password);
    await login.buttonLogin();

    await url.checkUrl('https://mytask-staging.transtrack.id/dashboard');

    await context.storageState({ path: outputFile });
}

async function globalSetup() {
    const browser = await chromium.launch();

    const userContext = await browser.newContext();
    const userPage = await userContext.newPage();

    await loginAndSave(userContext, userPage, 'bagas@transtrack.id', 'Password123@', 'user.json');

    await browser.close();
}

export default globalSetup;