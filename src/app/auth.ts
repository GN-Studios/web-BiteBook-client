const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const base64UrlEncode = (str: string) => {
  // proper unicode-safe base64
  const utf8 = unescape(encodeURIComponent(str));
  const b64 = btoa(utf8);
  return b64.replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
};

const base64UrlDecode = (b64u: string) => {
  const b64 = b64u.replace(/-/g, "+").replace(/_/g, "/");
  try {
    const str = atob(b64);
    return decodeURIComponent(escape(str));
  } catch {
    return null;
  }
};

export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const setUser = (u: Record<string, any> | null) => {
  if (!u) localStorage.removeItem(USER_KEY);
  else localStorage.setItem(USER_KEY, JSON.stringify(u));
};

export const getStoredUser = () => {
  const v = localStorage.getItem(USER_KEY);
  if (!v) return null;
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
};

export const clearUser = () => localStorage.removeItem(USER_KEY);

export const parseJwtPayload = (token: string | null) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const payload = base64UrlDecode(parts[1]);
  if (!payload) return null;
  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  const t = getToken();
  if (!t) return false;
  const payload = parseJwtPayload(t);
  if (!payload) return false;
  if (typeof payload.exp === "number") {
    return payload.exp * 1000 > Date.now();
  }
  return true;
};

export const getUserFromToken = () => {
  const p = parseJwtPayload(getToken());
  if (!p) return null;
  // expect user fields like name/email/avatar at top-level
  const { name, email, avatar } = p;
  if (name || email || avatar) return { name, email, avatar };
  // fallback to stored user (server returned user object alongside token)
  return getStoredUser();
};

export const createFakeToken = (user: Record<string, any>, expiresInSeconds = 60 * 60) => {
  const header = { alg: "none", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = { ...user, exp };
  const token = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}.`;
  return token;
};
