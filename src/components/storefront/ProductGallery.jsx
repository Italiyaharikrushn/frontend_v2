import React from 'react';
import { ShoppingBag } from 'lucide-react';

const ProductGallery = ({ product }) => {
  return (
    <div className="product-image-section">
      <div className="image-wrapper">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.title} className="main-product-image" />
        ) : (
          <div className="product-image-placeholder">
            <ShoppingBag size={64} className="placeholder-icon" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
