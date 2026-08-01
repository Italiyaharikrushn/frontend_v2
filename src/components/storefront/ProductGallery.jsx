import React, { useState } from 'react';
import { ShoppingBag, Play } from 'lucide-react';

const ProductGallery = ({ product }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const mediaList = [
    ...(product.videos || []).map(url => ({ type: 'video', url })),
    ...(product.images || []).map(url => ({ type: 'image', url }))
  ];

  const activeMedia = mediaList[activeIndex];

  return (
    <div className="product-image-section">
      <div className="image-wrapper">
        {activeMedia ? (
          activeMedia.type === 'video' ? (
            <video src={activeMedia.url} autoPlay muted loop playsInline className="main-product-video" />
          ) : (
            <img src={activeMedia.url} alt={product.title} className="main-product-image" />
          )
        ) : (
          <div className="product-image-placeholder">
            <ShoppingBag size={64} className="placeholder-icon" />
          </div>
        )}
      </div>

      {mediaList.length > 1 && (
        <div className="product-thumbnails">
          {mediaList.map((media, index) => (
            <button
              key={`${media.type}-${index}`}
              className={`thumbnail-btn ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`View ${media.type} ${index + 1}`}
            >
              {media.type === 'video' ? (
                <div className="thumbnail-video-wrapper">
                  <video src={media.url} className="thumbnail-media" />
                  <div className="video-play-overlay">
                    <Play size={16} fill="white" />
                  </div>
                </div>
              ) : (
                <img src={media.url} alt={`Thumbnail ${index + 1}`} className="thumbnail-media" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
