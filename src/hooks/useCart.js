import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, updateQuantity, clearCart, selectCartItems, selectCartTotalQuantity } from '../redux/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalQuantity = useSelector(selectCartTotalQuantity);

  const handleAddItem = (item) => dispatch(addItem(item));
  const handleRemoveItem = (id) => dispatch(removeItem(id));
  const handleUpdateQuantity = (id, change) => dispatch(updateQuantity({ id, change }));
  const handleClearCart = () => dispatch(clearCart());

  return {
    items,
    totalQuantity,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
  };
};

export default useCart;
