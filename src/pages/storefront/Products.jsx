import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag } from 'lucide-react';
import Button from '../../components/ui/Button';
import SkeletonCard from '../../components/ui/SkeletonCard';
import { addItem } from '../../redux/cartSlice';
import { selectIsAuthenticated } from '../../redux/authSlice';
import { useGetProductsQuery } from '../../api/productApi';
import { useAddToBackendCartMutation } from '../../api/orderApi';
import { useToast } from '../../components/ui/ToastProvider';
import '@/styles/css/pages/storefront/Products.css';
import ProductDetails from './ProductDetails';

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const searchQuery = queryParams.get('search');
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { pushToast } = useToast();
  const [quickViewProductId, setQuickViewProductId] = useState(null);

  const { data: allProducts = [], isLoading } = useGetProductsQuery();
  const [addToBackendCart] = useAddToBackendCartMutation();

  const dynamicCategories = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return ["All"];

    const catSet = new Set();
    allProducts.forEach(p => {
      if (p.category) {
        const capitalized = p.category.charAt(0).toUpperCase() + p.category.slice(1).toLowerCase();
        catSet.add(capitalized);
      }
    });

    return ["All", ...Array.from(catSet).sort()];
  }, [allProducts]);

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
      price: product.discountPrice ? parseFloat(product.discountPrice) : parseFloat(product.price),
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

  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams(location.search);
    if (cat === "All") {
      params.delete('category');
    } else {
      params.set('category', cat.toLowerCase());
    }
    navigate({ search: params.toString() });
  };

  return (
    <div className="products-page fade-in">
      <div className="products-header">
        <h1 className="products-title">{title}</h1>
        <p className="products-subtitle">{subtitle}</p>
      </div>

      <div className="category-tabs">
        {dynamicCategories.map((cat) => {
          const isActive = category
            ? category.toLowerCase() === cat.toLowerCase()
            : cat === "All";

          return (
            <button
              key={cat}
              className={`category-tab ${isActive ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="products-grid">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
        ) : products.length > 0 ? products.map((product) => {
          const isActive = product.isActive ?? product.active ?? true;
          const isPhoneCover = product.category?.toLowerCase().includes('cover') || product.title?.toLowerCase().includes('cover');
          return (
            <div key={product.id} className="product-card glass-panel hover-lift">
              <div onClick={() => setQuickViewProductId(product.id)} className="product-image-container" style={{ display: 'block', cursor: 'pointer' }}>
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.title} />
                ) : (
                  <ShoppingBag size={48} className="product-placeholder-icon pulse-element" style={{ animationDuration: '4s' }} />
                )}
              </div>
              <div className="product-details">
                <div onClick={() => setQuickViewProductId(product.id)} style={{ cursor: 'pointer', color: 'inherit' }}>
                  <h3 className="product-name">{product.title}</h3>
                </div>
                {product.discountPrice ? (
                  <p className="product-price" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>₹{product.discountPrice}</span>
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.85em' }}>₹{product.price}</span>
                    <span style={{ fontSize: '0.75em', padding: '0.15rem 0.4rem', background: 'var(--success)', color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>
                      {Math.round(((parseFloat(product.price) - parseFloat(product.discountPrice)) / parseFloat(product.price)) * 100)}% OFF
                    </span>
                  </p>
                ) : (
                  <p className="product-price">₹{product.price}</p>
                )}
                <div className="product-actions">
                  {isPhoneCover ? (
                    <Button
                      fullWidth
                      variant={isActive ? 'primary' : 'secondary'}
                      disabled={!isActive}
                      onClick={() => setQuickViewProductId(product.id)}
                    >
                      {isActive ? 'Select Model' : 'Unavailable'}
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant={isActive ? 'primary' : 'secondary'}
                      disabled={!isActive}
                      onClick={() => handleAddToCart(product)}
                    >
                      {isActive ? 'Add to Cart' : 'Unavailable'}
                    </Button>
                  )}
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

      {quickViewProductId && (
        <ProductDetails 
          productId={quickViewProductId} 
          onClose={() => setQuickViewProductId(null)} 
        />
      )}
    </div>
  );
};

export default Products;

