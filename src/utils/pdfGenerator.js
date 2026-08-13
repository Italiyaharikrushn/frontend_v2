import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatPhoneNumber, formatCurrency } from './formatters';

export const generatePdfLabels = (orderIdsToPrint, orders, storeSettings) => {
    if (!orderIdsToPrint || orderIdsToPrint.length === 0) return;

    const doc = new jsPDF('p', 'mm', 'a4');
    
    orderIdsToPrint.forEach((id, index) => {
      const order = orders.find(o => o.id === id);
      if (!order) return;

      if (index > 0) doc.addPage();
      
      const pageWidth = doc.internal.pageSize.getWidth(); // 210
      const pageHeight = doc.internal.pageSize.getHeight(); // 297
      const margin = 10;
      const contentWidth = pageWidth - 2 * margin; // 190
      
      // Main Outer Border
      let currentY = margin;
      
      // --- TOP SECTION (Address & Shipping Label) ---
      const topSectionHeight = 85;
      
      // Left Box (Address)
      const leftBoxWidth = contentWidth * 0.45;
      doc.rect(margin, currentY, leftBoxWidth, topSectionHeight);
      
      // Right Box (Shipping)
      const rightBoxWidth = contentWidth * 0.55;
      doc.rect(margin + leftBoxWidth, currentY, rightBoxWidth, topSectionHeight);
      
      // Left Box Content
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Customer Address', margin + 2, currentY + 5);
      
      doc.setFontSize(11);
      doc.text(`${order.customerName || 'N/A'}`, margin + 2, currentY + 11);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const addr = order.shippingAddress;
      let leftY = currentY + 16;
      if (addr) {
        if (addr.street) { 
           const splitStreet = doc.splitTextToSize(addr.street, leftBoxWidth - 4);
           doc.text(splitStreet, margin + 2, leftY); 
           leftY += splitStreet.length * 4; 
        }
        if (addr.city || addr.state || addr.zipCode) {
           doc.text(`${addr.city || ''}, ${addr.state || ''} ${addr.zipCode || ''}`, margin + 2, leftY);
           leftY += 4;
        }
        if (addr.phoneNumber) { doc.text(`Phone: ${formatPhoneNumber(addr.phoneNumber)}`, margin + 2, leftY); leftY += 4; }
      }
      if (order.customerEmail) doc.text(`Email: ${order.customerEmail}`, margin + 2, leftY);

      // Separator Line in Left Box
      doc.line(margin, currentY + 40, margin + leftBoxWidth, currentY + 40);
      
      // Return Address
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('If undelivered, return to:', margin + 2, currentY + 45);
      
      const storeName = storeSettings?.settings?.storeSettings?.storeName || 'Store Name';
      doc.text(storeName.toUpperCase(), margin + 2, currentY + 50);
      
      doc.setFont('helvetica', 'normal');
      let returnY = currentY + 54;
      const contacts = storeSettings?.settings?.contacts;
      if (contacts?.address?.street) {
          const splitStreet = doc.splitTextToSize(contacts.address.street, leftBoxWidth - 4);
          doc.text(splitStreet, margin + 2, returnY);
          returnY += splitStreet.length * 4;
      }
      if (contacts?.address?.city || contacts?.address?.state || contacts?.address?.pincode) {
          doc.text(`${contacts.address.city || ''}, ${contacts.address.state || ''} ${contacts.address.pincode || ''}`, margin + 2, returnY);
          returnY += 4;
      }
      if (contacts?.phone) {
          doc.text(`Phone: ${formatPhoneNumber(contacts.phone)}`, margin + 2, returnY);
      }
      
      // Right Box Content
      // Black header background
      doc.setFillColor(0, 0, 0);
      doc.rect(margin + leftBoxWidth, currentY, rightBoxWidth, 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('PREPAID ORDER', margin + leftBoxWidth + 2, currentY + 5.5);
      
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('', margin + leftBoxWidth + 2, currentY + 16);
      
      doc.setFontSize(8);
      doc.setFillColor(0, 0, 0);
      doc.rect(margin + leftBoxWidth + 2, currentY + 20, 15, 5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text('Pickup', margin + leftBoxWidth + 4, currentY + 23.5);
      doc.setTextColor(0, 0, 0);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Destination Code', margin + leftBoxWidth + 2, currentY + 30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`${addr?.city ? addr.city.toUpperCase() : 'N/A'}_D`, margin + leftBoxWidth + 2, currentY + 34);
      
      doc.setFont('helvetica', 'bold');
      doc.text(`(${addr?.state || 'State'})`, margin + leftBoxWidth + 2, currentY + 44);
      
      doc.setFont('helvetica', 'normal');
      doc.text('Return Code', margin + leftBoxWidth + 2, currentY + 52);
      doc.setFont('helvetica', 'bold');
      doc.text(`${contacts?.address?.pincode || ''}`, margin + leftBoxWidth + 2, currentY + 56);
      
      // QR Code Blank Space
      // Leaving 30x30 mm blank at (margin + leftBoxWidth + rightBoxWidth - 35, currentY + 12)
      
      // Barcode Blank Space
      // AWB Number Text Placeholder
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      const awbNo = order.trackingNumber || `${order.id}${new Date().getTime()}`;
      doc.text(awbNo.toString(), margin + leftBoxWidth + (rightBoxWidth / 2), currentY + 68, { align: 'center' });
      // Leaving Barcode Space below AWB at (margin + leftBoxWidth + 10, currentY + 70, rightBoxWidth - 20, 12)
      
      currentY += topSectionHeight;
      doc.setDrawColor(0, 0, 0);
      
      // --- PRODUCT DETAILS SECTION ---
      doc.rect(margin, currentY, contentWidth, 20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Product Details', margin + 2, currentY + 5);
      
      // Minimal AutoTable for Product Specs
      const productDetailsRows = [];
      let itemSku = 'N/A';
      let itemSize = 'Free Size';
      let itemColor = 'NA';
      if (order.orderItems && order.orderItems.length > 0) {
         const firstItem = order.orderItems[0];
         itemSku = firstItem.sku || firstItem.productName?.substring(0, 15) || 'Product';
         itemSize = firstItem.size || 'Free Size';
         itemColor = firstItem.color || 'NA';
      }
      
      productDetailsRows.push([
         itemSku,
         itemSize,
         (order.orderItems?.reduce((acc, curr) => acc + (curr.quantity || 1), 0) || 1).toString(),
         itemColor,
         order.id.toString()
      ]);
      
      autoTable(doc, {
        startY: currentY + 7,
        head: [['SKU', 'Size', 'Qty', 'Color', 'Order No.']],
        body: productDetailsRows,
        theme: 'plain',
        styles: { fontSize: 9, cellPadding: 1, textColor: [0, 0, 0] },
        headStyles: { fontStyle: 'bold' },
        margin: { left: margin + 1 }
      });
      
      currentY += 20;
      
      // --- TAX INVOICE HEADER ---
      doc.rect(margin, currentY, contentWidth, 6);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('TAX INVOICE', pageWidth / 2, currentY + 4.5, { align: 'center' });
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Original For Recipient', margin + contentWidth - 2, currentY + 4.5, { align: 'right' });
      
      currentY += 6;
      
      // --- BILLING & SELLER INFO ---
      const billingSectionHeight = 35;
      const billLeftWidth = contentWidth * 0.45;
      const billRightWidth = contentWidth * 0.55;
      
      doc.rect(margin, currentY, billLeftWidth, billingSectionHeight);
      doc.rect(margin + billLeftWidth, currentY, billRightWidth, billingSectionHeight);
      
      // Bill Left
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('BILL TO / SHIP TO', margin + 2, currentY + 4);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      
      let billY = currentY + 8;
      const billAddrText = `${order.customerName || 'N/A'} - ${addr?.street || ''}, ${addr?.city || ''}, ${addr?.state || ''}, ${addr?.zipCode || ''}`;
      const splitBillAddr = doc.splitTextToSize(billAddrText, billLeftWidth - 4);
      doc.text(splitBillAddr, margin + 2, billY);
      billY += splitBillAddr.length * 3.5;
      doc.text(`Place of Supply: ${addr?.state || ''}`, margin + 2, billY + 2);
      
      // Bill Right
      doc.setFont('helvetica', 'normal');
      doc.text('Sold by : ', margin + billLeftWidth + 2, currentY + 4);
      doc.setFont('helvetica', 'bold');
      doc.text(storeName.toUpperCase(), margin + billLeftWidth + 14, currentY + 4);
      doc.setFont('helvetica', 'normal');
      
      let sellerY = currentY + 8;
      const sellerAddrStr = `${contacts?.address?.street || ''}, ${contacts?.address?.city || ''}, ${contacts?.address?.state || ''}, ${contacts?.address?.pincode || ''}`;
      const splitSellerAddr = doc.splitTextToSize(sellerAddrStr, billRightWidth - 4);
      doc.text(splitSellerAddr, margin + billLeftWidth + 2, sellerY);
      sellerY += splitSellerAddr.length * 3.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      sellerY += 8;
      doc.text('Purchase Order No.', margin + billLeftWidth + 2, sellerY);
      doc.text('Invoice No.', margin + billLeftWidth + billRightWidth / 3 + 2, sellerY);
      doc.text('Order Date', margin + billLeftWidth + (2 * billRightWidth) / 3 + 2, sellerY);
      doc.text('Invoice Date', margin + billLeftWidth + billRightWidth - 15, sellerY);
      
      doc.setFont('helvetica', 'bold');
      sellerY += 4;
      doc.text(order.id.toString(), margin + billLeftWidth + 2, sellerY);
      doc.text(`INV-${order.id}`, margin + billLeftWidth + billRightWidth / 3 + 2, sellerY);
      doc.text(new Date(order.orderDate).toLocaleDateString('en-GB'), margin + billLeftWidth + (2 * billRightWidth) / 3 + 2, sellerY);
      doc.text(new Date().toLocaleDateString('en-GB'), margin + billLeftWidth + billRightWidth - 15, sellerY);
      
      currentY += billingSectionHeight;
      
      // --- TAX & TOTAL TABLE ---
      const taxTableCols = ['Description', 'HSN', 'Qty', 'Gross Amount', 'Discount', 'Taxable Value', 'Taxes', 'Total'];
      const taxTableRows = [];
      
      let sumTaxable = 0;
      let sumTax = 0;
      let sumTotal = 0;
      
      if (order.orderItems && order.orderItems.length > 0) {
          order.orderItems.forEach(item => {
              const qty = item.quantity || 1;
              const price = item.price || 0;
              const totalItemPrice = qty * price;
              const taxRate = 0;
              const taxableVal = totalItemPrice;
              const taxAmt = 0;
              
              sumTaxable += taxableVal;
              sumTax += taxAmt;
              sumTotal += totalItemPrice;
              
              taxTableRows.push([
                  item.productName || 'Product',
                  '3004', 
                  qty.toString(),
                  formatCurrency(totalItemPrice),
                  formatCurrency(0),
                  formatCurrency(taxableVal),
                  formatCurrency(0),
                  formatCurrency(totalItemPrice)
              ]);
          });
      } else {
          taxTableRows.push(['Custom Order', 'N/A', '1', formatCurrency(order.totalAmount), formatCurrency(0), formatCurrency(order.totalAmount), formatCurrency(0), formatCurrency(order.totalAmount)]);
          sumTotal = order.totalAmount;
      }
      
      const otherCharges = order.totalAmount - sumTotal;
      if (otherCharges > 0.01 || otherCharges < -0.01) {
          const shipTaxRate = 0;
          const shipTaxable = otherCharges;
          const shipTax = 0;
          sumTaxable += shipTaxable;
          sumTax += shipTax;
          sumTotal += otherCharges;
          
          taxTableRows.push([
              'Other Charges',
              '9968',
              'NA',
              formatCurrency(otherCharges),
              formatCurrency(0),
              formatCurrency(shipTaxable),
              formatCurrency(0),
              formatCurrency(otherCharges)
          ]);
      }
      
      // Add Total Row at the end
      taxTableRows.push([
          { content: 'Total', styles: { fontStyle: 'bold' } },
          '',
          '',
          '',
          '',
          '',
          { content: formatCurrency(sumTax), styles: { fontStyle: 'bold' } },
          { content: formatCurrency(order.totalAmount), styles: { fontStyle: 'bold' } }
      ]);
      
      autoTable(doc, {
          startY: currentY,
          head: [taxTableCols],
          body: taxTableRows,
          theme: 'plain',
          styles: { fontSize: 7, cellPadding: 2, textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [0, 0, 0] },
          headStyles: { fontStyle: 'bold', fillColor: [245, 245, 245], lineWidth: 0.1, lineColor: [0, 0, 0] },
          columnStyles: {
              0: { cellWidth: 40 },
              6: { halign: 'right' },
              7: { halign: 'right' }
          }
      });
      
      const finalY = doc.lastAutoTable.finalY;
      
      // --- FOOTER ---
      doc.rect(margin, finalY, contentWidth, 12);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      const footerText = "Tax is not payable on reverse charge basis. This is a computer generated invoice and does not require signature. Other charges are charges that are applicable to your order and include charges for logistics fee (where applicable). Includes discounts for your city and/or for online payments (as applicable)";
      doc.text(doc.splitTextToSize(footerText, contentWidth - 4), margin + 2, finalY + 4);
      
    });

    doc.save(`shipping_labels_${new Date().getTime()}.pdf`);
};
