import {test,expect} from '@playwright/test';
// Run separately against a local build without Supabase configuration.
test('missing configuration is localized and never crashes form submissions', async({page,baseURL})=>{
 if (!baseURL || !['localhost','127.0.0.1'].includes(new URL(baseURL).hostname)) throw Error('Local-only test: refusing a production submission');
 for(const [path,button] of [['/register','Creează cont'],['/login','Autentificare'],['/forgot-password','Trimite linkul'],['/reset-password','Actualizează parola']]){
  await page.goto(path);
  const email=page.locator('input[name=email]');if(await email.count())await email.fill('test@example.invalid');
  const password=page.locator('input[name=password]');if(await password.count())await password.fill('testpass123');
  const confirm=page.locator('input[name=confirmation]');if(await confirm.count())await confirm.fill('testpass123');
  await page.locator('form').getByRole('button',{name:button,exact:true}).click();
  await expect(page.locator('#main-content').getByRole('alert')).toContainText('momentan');
 }
});
