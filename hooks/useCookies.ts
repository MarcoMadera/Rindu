import { useCallback } from "react";

export default function useCookies(): {
  getCookie: (cookieName: string) => string | undefined;
  setCookie: (name: string, value: string, age: string) => void;
  deleteCookie: (cookieName: string) => void;
} {
  const getCookie = useCallback((cookieName): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cookieName}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift();
    }
    return;
  }, []);

  const setCookie = useCallback((name, value, age) => {
    document.cookie = `${name}=${value}; max-age=${age}; Path=/;"`;
  }, []);

  const deleteCookie = useCallback((cookieName) => {
    document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;
  }, []);
  return {
    getCookie,
    setCookie,
    deleteCookie,
  };
}
