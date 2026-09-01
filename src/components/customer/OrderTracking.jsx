import React from 'react';
import { Package, Truck, CalendarCheck, RotateCcw, ThumbsDown, CheckCircle, XCircle, Check, Circle, MapPin, PackageCheck } from 'lucide-react';
import './OrderTracking.css';

const OrderTracking = ({ order }) => {
  if (!order) return null;

  const status = order.status || 'PENDING';

  // Base configuration of all possible steps with icons and labels
  const stepConfig = {
    PENDING: { label: 'Order Placed', desc: 'Your order has been placed successfully', icon: PackageCheck },
    READY_TO_SHIP: { label: 'Ready to Ship', desc: 'Your order is packed and ready', icon: Package },
    SHIPPED: { label: 'Shipped', desc: 'Your order is on the way', icon: Truck },
    DELIVERED: { label: 'Delivered', desc: 'Package delivered to you', icon: CalendarCheck },
    CANCELLED: { label: 'Cancelled', desc: 'This order has been cancelled', icon: XCircle },
    RETURN_REQUESTED: { label: 'Return Requested', desc: 'Return request submitted', icon: RotateCcw },
    RETURN_REJECTED: { label: 'Return Rejected', desc: 'Return request was declined', icon: ThumbsDown },
    RETURNED: { label: 'Returned', desc: 'Items successfully returned', icon: Package },
    REFUNDED: { label: 'Refunded', desc: 'Refund has been processed', icon: CheckCircle }
  };

  // Determine the sequence based on the current status
  let stepsSequence = [];

  if (['PENDING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED'].includes(status)) {
    stepsSequence = ['PENDING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED'];
  } else if (status === 'CANCELLED') {
    // Show cancelled flow as per user example
    stepsSequence = ['PENDING', 'READY_TO_SHIP', 'CANCELLED'];
  } else if (['RETURN_REQUESTED', 'RETURNED', 'REFUNDED'].includes(status)) {
    stepsSequence = ['DELIVERED', 'RETURN_REQUESTED', 'RETURNED', 'REFUNDED'];
  } else if (status === 'RETURN_REJECTED') {
    stepsSequence = ['DELIVERED', 'RETURN_REQUESTED', 'RETURN_REJECTED'];
  }

  // Calculate index of current status in the sequence
  const currentIndex = stepsSequence.indexOf(status);

  // If status is somehow not in the sequence, just render something safe
  if (currentIndex === -1) {
    return null;
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Map to final format for rendering
  const steps = stepsSequence.map((stepKey, index) => {
    let state = 'upcoming'; // upcoming, current, completed, error-state

    if (index < currentIndex) {
      state = 'completed';
    } else if (index === currentIndex) {
      state = (stepKey === 'CANCELLED' || stepKey === 'RETURN_REJECTED') ? 'error-state' : 'current';
    }

    // Determine the date
    let stepDate = null;
    if (stepKey === 'PENDING' && order.orderDate) {
      stepDate = formatDateTime(order.orderDate);
    } else if (stepKey === 'DELIVERED' && order.deliveryDate && (state === 'completed' || state === 'current')) {
      stepDate = formatDateTime(order.deliveryDate);
    } else if (state === 'upcoming' && stepKey === 'DELIVERED') {
      stepDate = 'Expected delivery';
    }

    return {
      id: stepKey,
      ...stepConfig[stepKey],
      state,
      date: stepDate
    };
  });

  // Calculate progress width decimal (0 to 1)
  const progressDecimal = steps.length > 1 ? Math.max(0, currentIndex) / (steps.length - 1) : 0;
  const isErrorState = status === 'CANCELLED' || status === 'RETURN_REJECTED';
  const currentLabel = stepConfig[status]?.label || status;

  return (
    <div className="premium-tracking-card fade-in">
      <div className="tracking-header">
        <div className="tracking-header-left">
          <h3>
            <MapPin size={22} style={{ color: 'var(--primary, #4f46e5)' }} />
            Order Tracking
          </h3>
          <p className="tracking-order-id">Order #{order.orderId || order.id}</p>
        </div>
        <div className="tracking-header-right">
          <span className={`tracking-current-status ${isErrorState ? 'status-error' : ''}`}>
            {currentLabel}
          </span>
        </div>
      </div>

      <div
        className="tracking-stepper"
        style={{
          '--progress-decimal': progressDecimal,
          '--step-count': steps.length
        }}
      >
        <div
          className={`tracking-progress-bar ${isErrorState ? 'error-bar' : ''}`}
        />

        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className={`tracking-step ${step.state}`}>
              <div className="step-indicator">
                {step.state === 'completed' ? (
                  <Check size={22} strokeWidth={3} />
                ) : step.state === 'error-state' ? (
                  <XCircle size={22} strokeWidth={2.5} />
                ) : step.state === 'current' ? (
                  <Icon size={20} strokeWidth={2.5} />
                ) : (
                  <Circle size={14} strokeWidth={3} />
                )}
              </div>
              <div className="step-content">
                <div className="step-label">{step.label}</div>
                {step.date && <div className="step-date">{step.date}</div>}
                <div className="step-desc">{step.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracking;
