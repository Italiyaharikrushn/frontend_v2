import React from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import { WRITTEN_POLICIES } from '../../utils/policyConstants';

const PolicyModal = ({
  activeModal,
  setActiveModal,
  modalData,
  setModalData,
  handleSaveModal,
  isUpdating
}) => {
  if (!activeModal) return null;

  const title = activeModal === 'rules'
    ? 'Return Rules'
    : WRITTEN_POLICIES.find(p => p.id === activeModal)?.label;

  return (
    <div className="modal-overlay-bg" onClick={() => setActiveModal(null)}>
      <div className="modal-content-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body-scroll">
          {activeModal !== 'rules' && (
            <h2 className="modal-title">
              {title}
            </h2>
          )}

          {activeModal === 'rules' ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Return Rules Section */}
              <div>
                <div className="rules-section-header">
                  <span className="rules-section-title">Return rules</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={modalData.isReturnsAccepted || false}
                      onChange={(e) => setModalData({ ...modalData, isReturnsAccepted: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="rules-section-desc">Applied to fulfilled items in an order</div>

                {modalData.isReturnsAccepted && (
                  <div className="rules-group-margin">
                    <div className="rules-input-group">
                      <div>
                        <label className="rules-label">Return window</label>
                        <select
                          className="rules-select"
                          value={modalData.returnWindow || "7 days"}
                          onChange={(e) => setModalData({ ...modalData, returnWindow: e.target.value })}
                        >
                          <option value="7 days">7 days</option>
                          <option value="14 days">14 days</option>
                        </select>
                      </div>
                      <div>
                        <label className="rules-label">Starting from</label>
                        <select
                          className="rules-select"
                          value={modalData.startingFrom || "Delivery of item"}
                          onChange={(e) => setModalData({ ...modalData, startingFrom: e.target.value })}
                        >
                          <option value="Delivery of item">Delivery of item</option>
                          <option value="Purchase date">Purchase date</option>
                          <option value="Shipment date">Shipment date</option>
                        </select>
                      </div>
                    </div>

                    <label className="rules-checkbox-label">
                      <input
                        type="checkbox"
                        className="rules-checkbox"
                        checked={modalData.extendWeekends || false}
                        onChange={(e) => setModalData({ ...modalData, extendWeekends: e.target.checked })}
                      />
                      Extend to account for weekends or holidays
                    </label>

                    <div style={{ marginTop: '1.25rem' }}>
                      <label className="rules-label">Return shipping</label>
                      <select
                        className="rules-select"
                        value={modalData.returnShipping || "Free return shipping"}
                        onChange={(e) => setModalData({ ...modalData, returnShipping: e.target.value })}
                      >
                        <option value="Free return shipping">Free return shipping</option>
                        <option value="Customer provides label">Customer provides label</option>
                        <option value="Flat rate">Flat rate</option>
                      </select>
                    </div>
                    <div className="rules-helper-text">Doesn't apply to POS returns</div>

                    <label className="rules-checkbox-label" style={{ marginTop: '1.25rem' }}>
                      <input
                        type="checkbox"
                        className="rules-checkbox"
                        checked={modalData.restockingFee || false}
                        onChange={(e) => setModalData({ ...modalData, restockingFee: e.target.checked })}
                      />
                      Charge restocking fee
                    </label>
                  </div>
                )}
              </div>

              <hr className="rules-divider" />

              {/* Cancellation Rules Section */}
              <div>
                <div className="rules-section-header">
                  <span className="rules-section-title">Cancellation rules</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={modalData.isCancellationAccepted !== false}
                      onChange={(e) => setModalData({ ...modalData, isCancellationAccepted: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="rules-section-desc">Applied to unfulfilled items in an order</div>

                {modalData.isCancellationAccepted !== false && (
                  <div className="rules-half-width rules-group-margin">
                    <label className="rules-label">Cancellation window</label>
                    <select
                      className="rules-select"
                      value={modalData.cancellationWindow || "15 minutes"}
                      onChange={(e) => setModalData({ ...modalData, cancellationWindow: e.target.value })}
                    >
                      <option value="No cancellations">No cancellations</option>
                      <option value="15 minutes">15 minutes</option>
                      <option value="30 minutes">30 minutes</option>
                      <option value="1 hour">1 hour</option>
                      <option value="12 hours">12 hours</option>
                      <option value="24 hours">24 hours</option>
                    </select>
                  </div>
                )}
              </div>

              <hr className="rules-divider" />

              {/* Shipping & Tax Rules Section */}
              <div>
                <div className="rules-section-header">
                  <span className="rules-section-title">Shipping Charge & Tax Settings</span>
                </div>
                <div className="rules-section-desc">Set shipping charge and tax rate applied to customer checkout orders</div>

                <div className="rules-group-margin">
                  <div className="rules-input-group">
                    <div>
                      <label className="rules-label">Shipping Charge (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="input-field"
                        value={modalData.shippingCharge !== undefined && modalData.shippingCharge !== null ? modalData.shippingCharge : ''}
                        onChange={(e) => setModalData({ ...modalData, shippingCharge: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                        placeholder="0.00"
                        style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '0.5rem', width: '100%' }}
                      />
                    </div>
                    <div>
                      <label className="rules-label">Tax Rate (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="input-field"
                        value={modalData.taxPercentage !== undefined && modalData.taxPercentage !== null ? modalData.taxPercentage : ''}
                        onChange={(e) => setModalData({ ...modalData, taxPercentage: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                        placeholder="0.00"
                        style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '0.5rem', width: '100%' }}
                      />
                    </div>
                  </div>
                  <div className="rules-helper-text">Calculated automatically on checkout subtotal</div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563', fontWeight: '500' }}>Policy Content</label>
              <textarea
                value={modalData[activeModal] || ''}
                onChange={(e) => setModalData({ ...modalData, [activeModal]: e.target.value })}
                className="input-field"
                rows="12"
                placeholder="Enter policy details here..."
                style={{ lineHeight: '1.6', fontFamily: 'inherit', border: '1px solid #d1d5db', borderRadius: '6px', padding: '0.75rem', width: '100%', resize: 'vertical' }}
              />
            </div>
          )}
        </div>

        {activeModal === 'rules' && (
          <div className="rules-footer">
            <div className="rules-footer-text">Return and cancellation rules apply to items purchased after the rules were turned on or updated</div>
          </div>
        )}

        <div className="rules-actions">
          <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveModal} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
