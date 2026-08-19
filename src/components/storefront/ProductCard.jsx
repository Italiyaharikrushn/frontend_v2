import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { useGetFavoritesQuery, useToggleFavoriteMutation } from '../../api/favoriteApi';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../redux/authSlice';
import { useToast } from '../../components/ui/ToastProvider';
import StarRating from './StarRating';
import '@/styles/components/ProductCard.css';

const ProductCard = ({ product }) => {
  const pId = product._id || product.id;
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: favorites } = useGetFavoritesQuery(undefined, { skip: !isAuthenticated });
  const [toggleFavorite] = useToggleFavoriteMutation();
  const { pushToast } = useToast();

  const isFavorite = favorites?.some(fav => fav.id === pId || fav._id === pId) || false;

  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // prevent triggering the link
    if (!isAuthenticated) {
      pushToast('Please login to save favorites', 'warning');
      return;
    }
    try {
      await toggleFavorite(pId).unwrap();
      pushToast(isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
    } catch (err) {
      pushToast('Failed to update favorites', 'error');
    }
  };

  return (
    <div className="product-card-wrapper">
      <Link
        to={product.category ? `/products?category=${encodeURIComponent(product.category.toLowerCase())}` : `/products`}
        className="product-card-link hover-lift"
      >
        <div className="product-card-image-container">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="product-card-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <ShoppingBag size={48} className="pulse-element product-card-placeholder" />
          )}

          <button
            className="product-favorite-btn"
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              size={20}
              fill={isFavorite ? '#ff4b4b' : 'none'}
              color={isFavorite ? '#ff4b4b' : 'var(--text-primary)'}
              style={{ transition: 'fill 0.3s ease, color 0.3s ease' }}
            />
          </button>
        </div>
      </Link>
      <h3 className="product-card-title">
        {product.title}
      </h3>
      <div style={{ padding: '0 1rem 1rem' }}>
        <StarRating rating={product.averageRating || 0} totalReviews={product.totalReviews || 0} size={14} />
      </div>
    </div>
  );
};

export default ProductCard;
