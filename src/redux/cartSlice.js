import { createSlice } from '@reduxjs/toolkit';

const loadCartState = () => {
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

const saveCartState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('cartState', serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

const initialState = loadCartState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateQuantity: (state, action) => {
      const { id, change } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = Math.max(1, item.quantity + change);
      }
      saveCartState(state);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCartState(state);
    },
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCartState(state);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartState(state);
    }
  },
});

export const { updateQuantity, removeItem, addItem, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQuantity = (state) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export default cartSlice.reducer;
