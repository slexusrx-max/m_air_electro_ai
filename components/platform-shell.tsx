import { DeepFooter } from '@/components/marketplace/deep-footer';
import { SiteHeader } from '@/components/site-header';
import { getCurrentProfile, getCurrentUser } from '@/lib/supabase/auth';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getRequestLocale } from '@/lib/i18n/request';
import { navigation } from '@/lib/marketplace/navigation';
type PlatformShellProps = { children: React.ReactNode; contentClassName?: string };
export async function PlatformShell({children,contentClassName='flex-1 px-4 pb-12 pt-8 sm:px-6 lg:px-8'}:PlatformShellProps){const [profile,user,locale]=await Promise.all([getCurrentProfile(),getCurrentUser(),getRequestLocale()]);return <div className="platform-root"><a className="skip-link" href="#main-content">{locale==='ro'?'Salt la conținut':'Skip to content'}</a><SiteHeader profile={user?{email:profile?.email??user.email??'',role:profile?.role??'client'}:null} dashboardHref="/dashboard" dictionary={getDictionary(locale)} locale={locale} groups={navigation(locale)}/><div id="main-content" className={contentClassName}>{children}</div><DeepFooter locale={locale}/></div>;}
