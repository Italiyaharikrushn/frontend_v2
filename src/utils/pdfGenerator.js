import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePdfLabels = (orderIdsToPrint, orders, storeSettings) => {
    if (!orderIdsToPrint || orderIdsToPrint.length === 0) return;

    const doc = new jsPDF();

    orderIdsToPrint.forEach((id, index) => {
      const order = orders.find(o => o.id === id);
      if (!order) return;

      if (index > 0) doc.addPage();

      // Header
      doc.setFontSize(20);
      doc.text('INVOICE', 14, 22);

      doc.setFontSize(10);
      doc.text(`Invoice Number: INV-${order.id}-${new Date().getTime()}`, 14, 30);
      doc.text(`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`, 14, 35);

      // Admin / Store Details
      doc.setFontSize(12);
      doc.text('FROM:', 14, 45);
      doc.setFontSize(10);
      doc.text(`${storeSettings?.storeName || 'Store Name'}`, 14, 50);

      let adminY = 55;
      if (storeSettings?.supportEmail) { doc.text(`Email: ${storeSettings.supportEmail}`, 14, adminY); adminY += 5; }
      if (storeSettings?.address) { doc.text(`Address: ${storeSettings.address}`, 14, adminY); adminY += 5; }
      if (storeSettings?.city || storeSettings?.state) {
        const cityState = `${storeSettings?.city || ''} ${storeSettings?.state || ''} ${storeSettings?.pincode || ''}`.trim();
        if (cityState) { doc.text(cityState, 14, adminY); adminY += 5; }
      }
      if (storeSettings?.contactNo) { doc.text(`Phone: ${storeSettings.contactNo}`, 14, adminY); }

      // Customer Details
      doc.setFontSize(12);
      doc.text('TO (CUSTOMER):', 120, 45);
      doc.setFontSize(10);
      doc.text(`${order.customerName || 'N/A'}`, 120, 50);
      if (order.customerEmail) doc.text(`Email: ${order.customerEmail}`, 120, 55);

      const addr = order.shippingAddress;
      let addrY = 60;
      if (addr) {
        if (addr.street) { doc.text(addr.street, 120, addrY); addrY += 5; }
        if (addr.city || addr.state) { doc.text(`${addr.city || ''}, ${addr.state || ''}`, 120, addrY); addrY += 5; }
        if (addr.zipCode) { doc.text(`Zip: ${addr.zipCode}`, 120, addrY); addrY += 5; }
        if (addr.country) { doc.text(addr.country, 120, addrY); }
      }

      // Order Items Table
      const tableColumn = ["Product Name", "Quantity", "Price"];
      const tableRows = [];
      let totalQty = 0;

      if (order.orderItems && order.orderItems.length > 0) {
        order.orderItems.forEach(item => {
          const qty = item.quantity || 1;
          totalQty += qty;
          tableRows.push([
            item.productName || 'Product',
            qty.toString(),
            `Rs. ${item.price || 0}`
          ]);
        });
      } else {
        tableRows.push(['Custom Order', '1', `Rs. ${order.totalAmount}`]);
        totalQty = 1;
      }

      autoTable(doc, {
        startY: Math.max(75, addrY + 5),
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
      });

      // Total
      const finalY = doc.lastAutoTable.finalY || 90;
      doc.setFontSize(12);
      doc.text(`Total Quantity: ${totalQty}`, 14, finalY + 10);
      doc.text(`Total Amount: Rs. ${order.totalAmount}`, 14, finalY + 15);
    });

    doc.save(`shipping_labels_${new Date().getTime()}.pdf`);
};
