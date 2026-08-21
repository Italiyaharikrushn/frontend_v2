import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, updateQuantity, setQuantity, removeItem, updateItemPrices } from '../redux/cartSlice';
import { useGetProductsByIdsMutation } from '../api/productApi';

export const useCartPage = () => {
  const dispatch = useDispatch();
  const rawCartItems = useSelector(selectCartItems);
  const [getProductsByIds, { data: allProducts = [], isLoading }] = useGetProductsByIdsMutation();

  useEffect(() => {
    if (rawCartItems.length > 0) {
      const ids = rawCartItems.map(item => item.id);
      getProductsByIds(ids);
    }
  }, [rawCartItems, getProductsByIds]);

  const cartItems = useMemo(() => {
    return rawCartItems.map(item => {
      const product = allProducts.find(p => p.id === item.id);
      if (product) {
        let latestPrice = product.discountPrice ? parseFloat(product.discountPrice) : parseFloat(product.price);
        if (item.coverType === 'custom_name' && product.customNamePrice) {
          latestPrice = product.discountCustomNamePrice ? parseFloat(product.discountCustomNamePrice) : parseFloat(product.customNamePrice);
        }
        return { ...item, price: latestPrice };
      }
      return item;
    });
  }, [rawCartItems, allProducts]);

  useEffect(() => {
    if (allProducts.length > 0 && rawCartItems.length > 0) {
      const needsUpdate = rawCartItems.some(item => {
        const product = allProducts.find(p => p.id === item.id);
        if (product) {
          let latestPrice = product.discountPrice ? parseFloat(product.discountPrice) : parseFloat(product.price);
          if (item.coverType === 'custom_name' && product.customNamePrice) {
            latestPrice = product.discountCustomNamePrice ? parseFloat(product.discountCustomNamePrice) : parseFloat(product.customNamePrice);
          }
          return item.price !== latestPrice;
        }
        return false;
      });
      if (needsUpdate) {
        dispatch(updateItemPrices(cartItems));
      }
    }
  }, [allProducts, rawCartItems, cartItems, dispatch]);

  const handleQuantity = (id, cartItemId, change) => {
    dispatch(updateQuantity({ id, cartItemId, change }));
  };

  const handleSetQuantity = (id, cartItemId, quantity) => {
    dispatch(setQuantity({ id, cartItemId, quantity }));
  };

  const handleRemove = async (id, cartItemId) => {
    dispatch(removeItem({ id, cartItemId }));
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return { cartItems, isLoading, subtotal, handleQuantity, handleSetQuantity, handleRemove };
};
