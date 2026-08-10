import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';

export const WRITTEN_POLICIES = [
  { id: 'returnAndRefundPolicy', label: 'Return and refund policy', icon: <FileText size={18} /> },
  { id: 'privacyPolicy', label: 'Privacy policy', icon: <ShieldCheck size={18} /> },
  { id: 'termsOfService', label: 'Terms of service', icon: <FileText size={18} /> },
  { id: 'shippingPolicy', label: 'Shipping policy', icon: <FileText size={18} /> },
  { id: 'contactInformation', label: 'Contact information', icon: <FileText size={18} /> },
  { id: 'legalNotice', label: 'Legal notice', icon: <FileText size={18} /> }
];
