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

export const saveCartState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('cartState', serializedState);
  } catch (err) {
    // Ignore write errors
  }
};
