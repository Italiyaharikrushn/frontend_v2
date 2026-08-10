import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import '@/styles/components/ProductCard.css';

const ProductCard = ({ product }) => {
  const pId = product._id || product.id;

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
        </div>
      </Link>
      <h3 className="product-card-title">
        {product.title}
      </h3>
    </div>
  );
};

export default ProductCard;
