import { forecastMonthArr } from "../pages/forecast.js";
import { monthArr, monthArrIndex, partOne, partTwo } from "./getTaxYear.js";
import { monthCallList } from "../pages/reports.js";
import { getTime, currentTime, displayDate } from "../pages/call.js";
const { jsPDF } = window.jspdf;

const leapYear = (year) => {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

const generatePdf = (viewDownload) => {

    let invoiceYear = partOne;
    if (monthArrIndex < 3) invoiceYear = partTwo;
    const fileName = `Megan Green ${monthArr[monthArrIndex]} ${invoiceYear} invoice.pdf`;
    let month = monthArrIndex + 1 < 10 ? `0${monthArrIndex + 1}` : `${monthArrIndex + 1}`;
    const invoiceNo = `INV-${month}${invoiceYear}`;
    const issueDate = `01/${month}/${invoiceYear}`;
    let day = '29';
    let dueMonth = month;
    if (monthArrIndex === 1 && !leapYear(invoiceYear)) {
        day = '01';
        dueMonth = '03';
    }
    const dueDate = `${day}/${dueMonth}/${invoiceYear}`;

    const invoiceColumns = [
        { header: 'Description', dataKey: 'call_type' }, 
        { header: 'Quantity', dataKey: 'call_num' }, 
        { header: 'Unit Price', dataKey: 'call_value' },
        { header: 'Amount', dataKey: 'total_value' }
    ];

    const invoiceBody = [];
    let invoiceTotal = 0;
    forecastMonthArr.forEach(item => {
        const dataItem = {
            call_num: item.call_num,
            call_value: `£${Math.floor(item.call_value / 100)}.00`,
            call_type: item.call_type,
            total_value: `£${Math.floor((item.call_num * item.call_value) / 100)}.00`
        }
        invoiceBody.push(dataItem);
        invoiceTotal += item.call_num * item.call_value;
    });

    const callListColumns = [
        { header: 'Date', dataKey: 'call_date' }, 
        { header: 'Time', dataKey: 'call_time' }, 
        { header: 'Name', dataKey: 'call_name' },
        { header: 'Type', dataKey: 'call_type' }
    ]

    const callListBody = [];
    if (monthCallList.length > 0) {
        monthCallList.forEach(call => {
            getTime(call.call_time);
            const callData = {
                call_date: displayDate, 
                call_time: currentTime, 
                call_name: call.call_name, 
                call_type: call.call_type
            }
            callListBody.push(callData);
        })
    }

    const CONFIG = {
        page: {
            width: 210, 
            height: 297,
            format: 'a4', 
            unit: 'mm',
            orientation: 'portrait'
        },
        margins: {
            top: 20, 
            right: 20, 
            bottom: 20, 
            left: 20
        }, 
        colors: {
            text: [0, 0, 0], 
            bg: [211, 211, 211]
        }, 
        fonts: {
            default: 12, 
            small: 8, 
            medium: 10, 
            large: 16, 
            title: 20
        }
    }

    const doc = new jsPDF({
        orientation: CONFIG.page.orientation, 
        unit: CONFIG.page.unit, 
        format: CONFIG.page.format
    });

    let yPosition = CONFIG.margins.top;
    const rightMargin = CONFIG.page.width - CONFIG.margins.right;
    let rightMarginInset = (CONFIG.page.width / 2) + CONFIG.margins.right;

    // Title
    doc.setFont(undefined, 'bold');
    doc.setFontSize(CONFIG.fonts.title);
    doc.text('INVOICE', rightMargin, yPosition, { align: 'right' });
    yPosition += 5;

    doc.setDrawColor(211, 211, 211);
    doc.setLineWidth(0.5);
    doc.line(CONFIG.margins.left, yPosition, rightMargin, yPosition);
    yPosition += 8;

    // Bill from
    doc.setFontSize(CONFIG.fonts.default);
    doc.text('Megan Green', rightMargin, yPosition, { align: 'right' });
    yPosition += 5;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(CONFIG.fonts.medium);
    doc.text('73 Sandy Point Road', rightMargin, yPosition, { align: 'right' });
    yPosition += 5;
    doc.text('Hayling Island', rightMargin, yPosition, { align: 'right' });
    yPosition += 5;
    doc.text('Hampshire', rightMargin, yPosition, { align: 'right' });
    yPosition += 5;
    doc.text('PO11 9RR', rightMargin, yPosition, { align: 'right' });
    yPosition += 5;
    doc.text('07983 966838', rightMargin, yPosition, { align: 'right' });
    yPosition += 5;
    doc.text('megvg@hotmail.com', rightMargin, yPosition, { align: 'right' });
    yPosition += 10;

    let billYPosition = yPosition;

    // Invoice details
    doc.text('Invoice No:', rightMarginInset, yPosition, { align: 'left' });
    doc.text(invoiceNo, rightMargin, yPosition, { align: 'right' });
    yPosition += 5;
    doc.text('Issue Date:', rightMarginInset, yPosition, { align: 'left' });
    doc.text(issueDate, rightMargin, yPosition, { align: 'right' });
    yPosition += 5;
    doc.text('Due Date:', rightMarginInset, yPosition, { align: 'left' });
    doc.text(dueDate, rightMargin, yPosition, { align: 'right' });
    yPosition += 5;

    // Bill to
    doc.setFont(undefined, 'bold');
    doc.setFontSize(CONFIG.fonts.default);
    doc.text('Kinly', CONFIG.margins.left, billYPosition);
    billYPosition += 5;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(CONFIG.fonts.medium);
    doc.text('Spaces Avon House', CONFIG.margins.left, billYPosition);
    billYPosition += 5;
    doc.text('Avonmore Road', CONFIG.margins.left, billYPosition);
    billYPosition += 5;
    doc.text('London', CONFIG.margins.left, billYPosition);
    billYPosition += 5;
    doc.text('W14 8TS', CONFIG.margins.left, billYPosition);
    billYPosition += 5;

    yPosition = billYPosition;

    // Invoice table
    doc.autoTable({
        columns: invoiceColumns, 
        body: invoiceBody, 
        startY: yPosition, 
        theme: 'grid',
        margin: { left: CONFIG.margins.left, right: CONFIG.margins.right }, 
        cellPadding: 5, 
        headStyles: {
            lineColor: CONFIG.colors.text,
            lineWidth: 0.1, 
            fillColor: CONFIG.colors.bg, 
            textColor: CONFIG.colors.text, 
            fontSize: CONFIG.fonts.default, 
            fontStyle: 'bold', 
            halign: 'center'
        }, 
        styles: {
            lineColor: CONFIG.colors.text,
            textColor: CONFIG.colors.text, 
            fontSize: CONFIG.fonts.medium
        }, 
        columnStyles: {
            0: { halign: 'left' }, 
            1: { halign: 'center' }, 
            2: { cellWidth: 30, halign: 'center' }, 
            3: { cellWidth: 30, halign: 'right' }, 
        }
    });

    yPosition = doc.lastAutoTable.finalY + 10;
    rightMarginInset = rightMargin - 30; 
    let lineWidth = rightMarginInset - 30;

    // Invoice total
    doc.setFontSize(CONFIG.fonts.default);
    doc.setFont(undefined, 'bold');
    doc.text(`£${Math.floor(invoiceTotal / 100)}.00`, rightMargin, yPosition, { align: 'right' });
    doc.text('Total', rightMarginInset, yPosition, { align: 'right' });
    yPosition += 5;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.1);
    doc.line(lineWidth, yPosition, rightMargin, yPosition);   
    yPosition += 10; 

    // Payment details
    doc.setFont(undefined, 'bold');
    doc.setFontSize(CONFIG.fonts.default);
    doc.text('PAY BY BANK TRANSFER', CONFIG.margins.left, yPosition);
    yPosition += 5;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(CONFIG.fonts.medium);
    doc.text('Sort Code: 20-11-43', CONFIG.margins.left, yPosition);
    yPosition += 5;
    doc.text('Account Number: 73541320', CONFIG.margins.left, yPosition);
    yPosition += 5;
    doc.text('Payment Reference: Kinly', CONFIG.margins.left, yPosition);
    yPosition += 5;
    doc.text('Name on Account: Miss Megan Green Business', CONFIG.margins.left, yPosition);
    yPosition += 10;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(CONFIG.fonts.default);
    doc.text('TERMS', CONFIG.margins.left, yPosition);
    yPosition += 5;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(CONFIG.fonts.medium);
    doc.text('Payment within 28 days from date of invoice', CONFIG.margins.left, yPosition);

    

    // Call list table
    if (callListBody.length > 0) {
        // Page break
        doc.addPage();

        yPosition = CONFIG.margins.top;

        doc.autoTable({
            columns: callListColumns, 
            body: callListBody, 
            startY: yPosition, 
            theme: 'plain',
            margin: { left: CONFIG.margins.left, right: CONFIG.margins.right }, 
            cellPadding: 5, 
            headStyles: { 
                textColor: CONFIG.colors.text, 
                fontSize: CONFIG.fonts.default, 
                fontStyle: 'bold'
            }, 
            styles: {
                textColor: CONFIG.colors.text, 
                fontSize: CONFIG.fonts.medium
            }
        });
    }

    if (viewDownload === 'view') doc.output('dataurlnewwindow', fileName);
    if (viewDownload === 'download') doc.save(fileName);
}

export { generatePdf };