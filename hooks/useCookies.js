import { useCallback } from "react";

export default function useCookies() {
  const getCookie = useCallback((cookieName) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cookieName}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }, []);
  const setCookie = useCallback((name, value, age) => {
    document.cookie = `${name}=${value}; max-age=${age}; Path=/;"`;
  }, []);
  function deleteCookie(cookieName) {
    return (document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`);
  }
  return {
    getCookie,
    setCookie,
    deleteCookie,
  };
}
