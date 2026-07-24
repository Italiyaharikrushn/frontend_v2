import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag } from 'lucide-react';
import Button from '../../components/ui/Button';
import SkeletonCard from '../../components/ui/SkeletonCard';
import { addItem } from '../../redux/cartSlice';
import { selectIsAuthenticated } from '../../redux/authSlice';
import { useGetProductsQuery } from '../../api/productApi';
import { useAddToBackendCartMutation } from '../../api/orderApi';
import { useToast } from '../../components/ui/ToastProvider';
import './Products.css';

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const searchQuery = queryParams.get('search');
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { pushToast } = useToast();

  const { data: allProducts = [], isLoading } = useGetProductsQuery();
  const [addToBackendCart] = useAddToBackendCartMutation();

  const products = allProducts.filter((p) => {
    if (category) return p.category?.toLowerCase() === category.toLowerCase() || p.globalCategory?.toLowerCase() === category.toLowerCase();
    if (searchQuery) return p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return true;
  });

  let title = 'Our Collection';
  let subtitle = 'Explore our complete collection of exquisite accessories designed to elevate your style.';
  if (searchQuery) {
    title = 'Search Results';
    subtitle = `Showing results for "${searchQuery}"`;
  } else if (category) {
    title = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    subtitle = `Explore our exclusive collection of ${title.toLowerCase()}.`;
  }

  const handleAddToCart = async (product) => {
    dispatch(addItem({
      id: product.id,
      name: product.title,
      price: parseFloat(product.price),
      category: category || 'general',
      image: (product.images && product.images.length > 0) ? product.images[0] : null,
    }));

    pushToast(`${product.title} added to your cart.`, 'success');

    if (isAuthenticated) {
      try {
        await addToBackendCart({ productId: product.id, quantity: 1 }).unwrap();
      } catch (error) {
        console.error('Failed to save item to database cart:', error);
      }
    }
  };

  return (
    <div className="products-page fade-in">
      <div className="products-header">
        <h1 className="products-title">{title}</h1>
        <p className="products-subtitle">{subtitle}</p>
      </div>

      <div className="products-grid">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
        ) : products.length > 0 ? products.map((product) => {
          const isActive = product.isActive ?? product.active ?? true;
          return (
            <div key={product.id} className="product-card glass-panel hover-lift">
              <Link to={`/product/${product.id}`} className="product-image-container" style={{ display: 'block' }}>
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.title} />
                ) : (
                  <ShoppingBag size={48} className="product-placeholder-icon pulse-element" style={{ animationDuration: '4s' }} />
                )}
              </Link>
              <div className="product-details">
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 className="product-name">{product.title}</h3>
                </Link>
                <p className="product-price">₹{product.price}</p>
                <div className="product-actions">
                  <Button
                    fullWidth
                    variant={isActive ? 'primary' : 'secondary'}
                    disabled={!isActive}
                    onClick={() => handleAddToCart(product)}
                  >
                    {isActive ? 'Add to Cart' : 'Unavailable'}
                  </Button>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="products-empty" style={{ gridColumn: '1 / -1' }}>
            No products found for this selection. Please try another search or browse the full catalog.
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

