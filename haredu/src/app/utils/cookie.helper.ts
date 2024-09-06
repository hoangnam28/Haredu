import { environment } from 'src/environments/environment';

const cookiePrf = 'haredu_';

export function getCookie(name: string): string | null {
  const nameEQ = `${cookiePrf}${name}` + '=';
  const listCookies = document.cookie.split(';');

  for (const element of listCookies) {
    let c = element;

    while (c.charAt(0) === ' ') c = c.substring(1, c.length);

    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
}

/**
 * @see https://stackoverflow.com/a/44945595
 */
export function removeAllCookies(excludes: Array<string> = []) {
  const cookies = document.cookie.split(';');

  for (const element of cookies) {
    const [cookieName] = element.split('=');

    !excludes.includes(cookieName.trim()) && deleteCookie(cookieName);
  }
}

export function deleteCookie(cookieName: string) {
  const name = cookieName.startsWith(cookiePrf) ? cookieName : `${cookiePrf}${cookieName}`;

  // Current document location
  document.cookie = `${name}=;expires=Sat Jan 01 00:00:00 2000`;
  document.cookie = `${name}=;expires=Sat Jan 01 00:00:00 2000; path=/`;
}

export function replaceCookie(cookieName: string, cookieValue: string) {
  const date = new Date();

  /** 12h */
  date.setTime(date.getTime() + 12 * 60 * 60 * 1000);

  document.cookie = `${cookiePrf}${cookieName}=${cookieValue};expires=${date}; domain=${environment.baseDomain}; path=/`;
}
