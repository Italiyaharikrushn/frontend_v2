import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatPhoneNumber } from './formatters';

const numberToWords = (num) => {
    if (num === 0) return 'Zero';
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str.trim();
};

export const generatePdfLabels = (orderIdsToPrint, orders, storeSettings) => {
    if (!orderIdsToPrint || orderIdsToPrint.length === 0) return;

    // A4 Portrait layout
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    orderIdsToPrint.forEach((id, index) => {
        const order = orders.find(o => o.id === id);
        if (!order) return;

        if (index > 0) doc.addPage();

        const margin = 15;
        const pageWidth = 210;
        const contentWidth = pageWidth - 2 * margin; // 180
        const midX = pageWidth / 2; // 105
        let currentY = 15;

        const addr = order.shippingAddress;
        const billingAddr = order.billingAddress || order.shippingAddress;
        const contacts = storeSettings?.settings?.contacts;
        const storeName = storeSettings?.settings?.storeSettings?.storeName || 'Your Business';

        // INVOICE Title
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Invoice', margin, currentY + 8);

        currentY += 15;

        // --- TOP SECTION ---
        const topSectionY = currentY;
        
        // COMPANY INFO
        let companyX = margin;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(storeName, companyX, currentY + 4);
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        let companyAddr = '';
        if (contacts?.address?.street) companyAddr += contacts.address.street + ', ';
        if (contacts?.address?.city) companyAddr += contacts.address.city + ', ';
        if (contacts?.address?.state) companyAddr += contacts.address.state + ' ';
        if (contacts?.address?.pincode) companyAddr += contacts.address.pincode;
        
        const splitCompanyAddr = doc.splitTextToSize(companyAddr || 'Store Address Details', midX - companyX - 5);
        doc.text(splitCompanyAddr, companyX, currentY + 9);

        // TOP RIGHT SECTION
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('Invoice No', midX + 5, currentY + 4);
        doc.text('Date of Invoice', midX + 35, currentY + 4);
        doc.text('Place of Supply', midX + 65, currentY + 4);
        
        doc.setFont('helvetica', 'normal');
        doc.text(order.orderId || `INV-${order.id}`, midX + 5, currentY + 8);
        doc.text(new Date(order.orderDate).toLocaleDateString('en-GB'), midX + 35, currentY + 8);
        doc.text(contacts?.address?.state || 'Delhi', midX + 65, currentY + 8);

        // Vertical Divider line between left and right top sections
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.2);
        
        // Dynamically compute the height to fit the text exactly, without extra blank space
        const leftSideHeight = splitCompanyAddr.length * 4 + 7;
        const rightSideHeight = 10; // "Invoice No" and "Date" only take up to Y+8
        const topSectionHeight = Math.max(leftSideHeight, rightSideHeight);
        
        doc.line(midX, currentY, midX, currentY + topSectionHeight);
        
        currentY += topSectionHeight + 4;
        
        // Horizontal line separator
        doc.line(margin, currentY, pageWidth - margin, currentY);

        currentY += 5;

        // --- BILLING / SHIPPING ---
        // Bill To (Left Side)
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('Bill To', margin, currentY + 4);

        doc.setFontSize(9);
        const billingCustomerName = (billingAddr && billingAddr.fullName) ? billingAddr.fullName : (order.customerName || 'N/A');
        doc.text(billingCustomerName, margin, currentY + 9);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        let billAddrStr = '';
        if (billingAddr) {
            const street = billingAddr.streetAddress || billingAddr.street || '';
            const city = billingAddr.city || '';
            const state = billingAddr.state || '';
            const zip = billingAddr.postalCode || billingAddr.zipCode || '';
            billAddrStr = `${street}\n${city}, ${state}, ${zip}`;
            if (billingAddr.phoneNumber) billAddrStr += `\nPh: ${formatPhoneNumber(billingAddr.phoneNumber)}`;
        }

        const splitBillAddr = doc.splitTextToSize(billAddrStr, (contentWidth / 2) - 10);
        doc.text(splitBillAddr, margin, currentY + 13);
        
        // Ship To (Right Side)
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('Ship To', midX + 5, currentY + 4);

        doc.setFontSize(9);
        const customerName = (addr && addr.fullName) ? addr.fullName : (order.customerName || 'N/A');
        doc.text(customerName, midX + 5, currentY + 9);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        let custAddrStr = '';
        if (addr) {
            const street = addr.streetAddress || addr.street || '';
            const city = addr.city || '';
            const state = addr.state || '';
            const zip = addr.postalCode || addr.zipCode || '';
            custAddrStr = `${street}\n${city}, ${state}, ${zip}`;
            if (addr.phoneNumber) custAddrStr += `\nPh: ${formatPhoneNumber(addr.phoneNumber)}`;
        }

        const splitCustAddr = doc.splitTextToSize(custAddrStr, (contentWidth / 2) - 10);
        doc.text(splitCustAddr, midX + 5, currentY + 13);

        const maxHeights = Math.max(splitBillAddr.length * 4, splitCustAddr.length * 4);
        currentY += 13 + maxHeights + 5;

        // --- TABLE ---
        const tableBody = [];
        let sumQty = 0;
        let sumTotal = 0;
        if (order.orderItems && order.orderItems.length > 0) {
            order.orderItems.forEach((item, i) => {
                const qty = item.quantity || 1;
                const price = parseFloat(item.price) || 0;
                const itemTotal = price * qty;
                sumQty += qty;
                sumTotal += itemTotal;
                tableBody.push([
                    i + 1,
                    item.sku || item.productName || 'Product',
                    qty.toString(),
                    price.toFixed(2),
                    itemTotal.toFixed(2)
                ]);
            });
        }

        // Total row in table - using empty string for col 0 to ensure alignment
        tableBody.push([
            '', 
            { content: 'Total (Rs)', styles: { halign: 'left', fontStyle: 'bold' } },
            { content: sumQty.toString(), styles: { halign: 'center', fontStyle: 'bold' } },
            { content: '', styles: { fontStyle: 'bold' } },
            { content: sumTotal.toFixed(2), styles: { halign: 'right', fontStyle: 'bold' } }
        ]);

        autoTable(doc, {
            startY: currentY,
            head: [['#', 'Description', 'Qty', 'Rate', 'Total']],
            body: tableBody,
            theme: 'plain',
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 9 },
            bodyStyles: { fontSize: 8, textColor: [0, 0, 0] },
            alternateRowStyles: { fillColor: [255, 255, 255] },
            margin: { left: margin, right: margin },
            columnStyles: {
                0: { cellWidth: 10, halign: 'left' },
                1: { cellWidth: 'auto', halign: 'left' },
                2: { cellWidth: 20, halign: 'center' },
                3: { cellWidth: 30, halign: 'right' },
                4: { cellWidth: 30, halign: 'right' }
            },
            didParseCell: function (data) {
                // Ensure header alignment perfectly matches column alignment
                if (data.section === 'head') {
                    if (data.column.index === 2) data.cell.styles.halign = 'center';
                    if (data.column.index === 3) data.cell.styles.halign = 'right';
                    if (data.column.index === 4) data.cell.styles.halign = 'right';
                }
                // Apply gray background to the Total row
                if (data.section === 'body' && data.row.index === tableBody.length - 1) {
                    data.cell.styles.fillColor = [240, 240, 240];
                    data.cell.styles.textColor = [0, 0, 0];
                }
            }
        });

        currentY = doc.lastAutoTable.finalY + 10;

        // --- BELOW TABLE ---
        // Amount in words
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('Total amount (in words)', margin, currentY);
        doc.setFont('helvetica', 'normal');

        const totalAmountStr = numberToWords(Math.round(order.totalAmount || 0)) + ' Rupees Only.';
        doc.text(totalAmountStr, margin, currentY + 5);

        // Tax breakdown (Right)
        doc.setFont('helvetica', 'normal');
        doc.text('Taxable Amount (Rs):', pageWidth - margin - 35, currentY, { align: 'right' });
        doc.text(parseFloat(order.totalAmount || 0).toFixed(2), pageWidth - margin, currentY, { align: 'right' });

        doc.text('Total Tax (Rs):', pageWidth - margin - 35, currentY + 5, { align: 'right' });
        doc.text('0.00', pageWidth - margin, currentY + 5, { align: 'right' });

        doc.setFont('helvetica', 'bold');
        doc.text('Total Amount (Rs):', pageWidth - margin - 35, currentY + 10, { align: 'right' });
        doc.text(parseFloat(order.totalAmount || 0).toFixed(2), pageWidth - margin, currentY + 10, { align: 'right' });

        currentY += 15;
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, currentY, pageWidth - margin, currentY); // Separator

        // --- FOOTER ---
        currentY += 5;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('Terms:', margin, currentY + 4);
        doc.setFont('helvetica', 'normal');
        doc.text('1. All disputes are subject to jurisdiction.', margin, currentY + 8);
        doc.text('2. Certified that the particulars given above are true and correct.', margin, currentY + 12);

        // Signature area
        doc.setFont('helvetica', 'bold');
        doc.text(`For ${storeName}`, pageWidth - margin, currentY + 4, { align: 'right' });

        // Draw a simulated signature using Times Italic
        doc.setFont('times', 'italic');
        doc.setFontSize(16);
        doc.text(storeName, pageWidth - margin - 10, currentY + 18, { align: 'right' });

        // Signature line
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.3);
        doc.line(pageWidth - margin - 50, currentY + 22, pageWidth - margin, currentY + 22);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text('Authorised Signatory', pageWidth - margin, currentY + 26, { align: 'right' });
    });

    doc.save(`Invoice_${new Date().getTime()}.pdf`);
};
