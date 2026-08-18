import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../redux/authSlice';
import { selectCartItems, setCartItems } from '../redux/cartSlice';
import { useGetBackendCartQuery, useSyncBackendCartMutation } from '../api/orderApi';
import { isTokenValid } from '../utils/storage';

export const useCartSync = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector((state) => state.auth?.token);
  const isAuthValid = isAuthenticated && isTokenValid(token);
  const cartItems = useSelector(selectCartItems);
  const cartItemsRef = useRef(cartItems);

  const { data: backendCart, isLoading, isSuccess, isFetching } = useGetBackendCartQuery(undefined, {
    skip: !isAuthValid,
  });


  const [syncBackendCart] = useSyncBackendCartMutation();
  const [hasInitialSyncCompleted, setHasInitialSyncCompleted] = useState(false);

  // Initial Sync on Login
  useEffect(() => {
    if (isAuthenticated && isSuccess && !isFetching && !hasInitialSyncCompleted) {
      if (backendCart && backendCart.cartItems) {
        const backendItems = backendCart.cartItems.map(item => {
          const product = item.product || {};
          const latestPrice = product.discountPrice ? parseFloat(product.discountPrice) : parseFloat(product.price);
          return {
            id: product.id,
            quantity: item.quantity,
            phoneModel: item.phoneModel,
            name: product.title || product.name,
            title: product.title || product.name,
            price: latestPrice,
            image: product.images && product.images.length > 0 ? product.images[0] : null,
            images: product.images || [],
            cartItemId: `${product.id}-${item.phoneModel || 'default'}-${Date.now() + Math.random()}`
          };
        });

        // Merge logic: If frontend has items, add them. Otherwise, just use backend.
        let mergedItems = [...cartItemsRef.current];

        backendItems.forEach(bItem => {
          const existingIndex = mergedItems.findIndex(mItem =>
            mItem.id === bItem.id && (mItem.phoneModel || '') === (bItem.phoneModel || '')
          );
          if (existingIndex === -1) {
            mergedItems.push(bItem);
          } else if (mergedItems[existingIndex].quantity < bItem.quantity) {
            mergedItems[existingIndex].quantity = bItem.quantity;
          }
        });

        const finalSyncItems = mergedItems.length > 0 ? mergedItems : backendItems;

        dispatch(setCartItems(finalSyncItems));
        cartItemsRef.current = finalSyncItems;

        const syncPayload = finalSyncItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          phoneModel: item.phoneModel
        }));

        syncBackendCart(syncPayload);
        setHasInitialSyncCompleted(true);
      }
    }
  }, [isAuthenticated, isSuccess, isFetching, backendCart, dispatch, syncBackendCart, hasInitialSyncCompleted]);

  // Reset sync state on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setHasInitialSyncCompleted(false);
    }
  }, [isAuthenticated]);

  // Sync subsequent cart changes to backend
  useEffect(() => {
    if (isAuthenticated && hasInitialSyncCompleted) {
      const currentCart = JSON.stringify(cartItems);
      const prevCart = JSON.stringify(cartItemsRef.current);

      if (currentCart !== prevCart) {
        cartItemsRef.current = cartItems;
        const syncPayload = cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          phoneModel: item.phoneModel
        }));
        syncBackendCart(syncPayload);
      }
    } else {
      cartItemsRef.current = cartItems;
    }
  }, [cartItems, isAuthenticated, hasInitialSyncCompleted, syncBackendCart]);
};

export default useCartSync;
