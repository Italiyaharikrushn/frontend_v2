import { createSlice } from '@reduxjs/toolkit';
import { loadCartState, saveCartState } from '../utils/storage';

const initialState = loadCartState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateQuantity: (state, action) => {
      const { id, cartItemId, change } = action.payload;
      const item = state.items.find(item => (cartItemId ? item.cartItemId === cartItemId : item.id === id));
      if (item) {
        item.quantity = Math.max(1, item.quantity + change);
      }
      saveCartState(state);
    },
    setQuantity: (state, action) => {
      const { id, cartItemId, quantity } = action.payload;
      const item = state.items.find(item => (cartItemId ? item.cartItemId === cartItemId : item.id === id));
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      saveCartState(state);
    },
    removeItem: (state, action) => {
      const { id, cartItemId } = action.payload;
      state.items = state.items.filter(item => (cartItemId ? item.cartItemId !== cartItemId : item.id !== id));
      saveCartState(state);
    },
    addItem: (state, action) => {
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && 
        (item.phoneModel || '') === (action.payload.phoneModel || '') &&
        (item.coverType || '') === (action.payload.coverType || '') &&
        (item.customName || '') === (action.payload.customName || '')
      );
      const qtyToAdd = action.payload.quantity || 1;
      if (existingItem) {
        existingItem.quantity += qtyToAdd;
      } else {
        state.items.push({ 
          ...action.payload, 
          quantity: qtyToAdd, 
          cartItemId: `${action.payload.id}-${action.payload.phoneModel || 'default'}-${action.payload.coverType || 'default'}-${Date.now()}`
        });
      }
      saveCartState(state);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartState(state);
    },
    updateItemPrices: (state, action) => {
      const updatedItems = action.payload;
      state.items = state.items.map(item => {
        const updatedItem = updatedItems.find(u => u.cartItemId === item.cartItemId);
        if (updatedItem) {
          return { ...item, price: updatedItem.price };
        }
        return item;
      });
      saveCartState(state);
    },
    setCartItems: (state, action) => {
      state.items = action.payload;
      saveCartState(state);
    }
  },
});

export const { updateQuantity, setQuantity, removeItem, addItem, clearCart, updateItemPrices, setCartItems } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQuantity = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0);

export default cartSlice.reducer;
