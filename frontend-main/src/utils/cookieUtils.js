// Cookie helper functions
export const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  // Simplified cookie setting for localhost development
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocalhost) {
    // For localhost, use minimal cookie settings
    document.cookie = `${name}=${encodeURIComponent(
      value
    )};expires=${expires.toUTCString()};path=/`;
  } else {
    // For production or other domains
    const isProduction = window.location.protocol === "https:";
    if (isProduction) {
      document.cookie = `${name}=${encodeURIComponent(
        value
      )};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
    } else {
      document.cookie = `${name}=${encodeURIComponent(
        value
      )};expires=${expires.toUTCString()};path=/;samesite=lax`;
    }
  }
};

export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
      return value;
    }
  }
  return null;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  // Also try with different path variations to ensure deletion
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;domain=${window.location.hostname}`;
};

// Helper function to get token from both cookies and localStorage
export const getToken = () => {
  return getCookie("token") || localStorage.getItem("token");
};
