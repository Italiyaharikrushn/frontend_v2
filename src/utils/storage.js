// Local storage utilities for Auth and Cart states

export const getStoredItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

export const setStoredItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
};

export const removeStoredItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Error removing ${key} from localStorage:`, e);
  }
};

export const loadCartState = () => {
  try {
    const serializedState = localStorage.getItem('cartState');
    if (serializedState === null) {
      return { items: [] };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { items: [] };
  }
};

export const isTokenValid = (token) => {
  if (!token || typeof token !== 'string') return false;
  let clean = token.trim();
  if (clean.startsWith('Bearer ')) {
    clean = clean.substring(7).trim();
  }
  if (!clean || clean === 'null' || clean === 'undefined') return false;

  try {
    const parts = clean.split('.');
    if (parts.length !== 3) return false;

    // Decode base64url payload
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);

    if (parsed.exp && typeof parsed.exp === 'number') {
      const nowSeconds = Math.floor(Date.now() / 1000);
      // 10 second safety buffer
      if (nowSeconds >= parsed.exp - 10) {
        return false;
      }
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const saveCartState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('cartState', serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

