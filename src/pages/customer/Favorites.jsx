import React from 'react';
import { useGetFavoritesQuery } from '../../api/favoriteApi';
import ProductCard from '../../components/customer/ProductCard';
import { Heart } from 'lucide-react';
import '@/styles/pages/customer/Products.css'; // Reuse product grid styles

const Favorites = () => {
    const { data: favorites, isLoading, error } = useGetFavoritesQuery();

    if (isLoading) {
        return (
            <div className="customer-container" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p>Loading favorites...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="customer-container" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p>Error loading favorites. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="products-header">
                <h1 className="products-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Heart size={28} className="text-primary" /> My Favorites
                </h1>
                <p className="products-subtitle">
                    Products you have saved for later.
                </p>
            </div>

            {favorites && favorites.length > 0 ? (
                <div className="products-grid">
                    {favorites.map((product) => (
                        <ProductCard key={product.id || product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
                    <Heart size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <h2 style={{ marginBottom: '0.5rem' }}>Your favorites list is empty</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Start exploring and heart the products you love!</p>
                </div>
            )}
        </div>
    );
};

export default Favorites;
