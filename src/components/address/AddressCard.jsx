import React from 'react';
import { Home, Phone, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault, isDefault }) => {
  return (
    <div className={`address-card glass-panel hover-lift ${address.isDefault || isDefault ? 'default-address' : ''}`} style={{ position: 'relative' }}>
      {(address.isDefault || isDefault) && (
        <span className="default-badge" style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: 'var(--shadow-sm)' }}>
          <CheckCircle2 size={14} /> Default
        </span>
      )}
      <div>
        <div className="address-card-header">
          <div className="address-card-name">{address.fullName}</div>
          <span style={{ color: 'var(--primary)', opacity: 0.7 }}>
            <Home size={20} />
          </span>
        </div>
        <div className="address-card-body">
          <p style={{ margin: 0 }}>{address.streetAddress}</p>
          <p style={{ margin: '0.2rem 0' }}>{address.city}, {address.state} - {address.postalCode}</p>
          <p style={{ margin: 0, fontWeight: '500' }}>{address.country}</p>
          <div className="address-card-phone" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', color: 'var(--text-muted)' }}>
            <Phone size={15} />
            <span>{address.phoneNumber}</span>
          </div>
        </div>
      </div>

      <div className="address-card-actions" style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        {onSetDefault && !(address.isDefault || isDefault) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetDefault(address.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <CheckCircle2 size={14} /> Set Default
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(address)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flex: 1, justifyContent: 'center' }}
        >
          <Edit2 size={14} /> Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(address.id)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flex: 1, justifyContent: 'center' }}
        >
          <Trash2 size={14} /> Delete
        </Button>
      </div>
    </div>
  );
};

export default AddressCard;
