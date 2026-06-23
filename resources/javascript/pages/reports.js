import { 
    siteUrl, unsubTot, unsubView, unsubHideBtn, unsubCont, nameList, invoiceCont, monthTax, ytdTax, totalTax, 
    unsubViewBtn, expenseSummary 
} from "../variables/variables.js";
import { 
    handleAuthError 
} from "../functions/headings.js";
 import { 
    partOne, partTwo, monthArrIndex
} from "../functions/getTaxYear.js";
import { 
    currentTime, displayDate, getTime, generateUnsubCalls 
} from "./call.js";
import { 
    forecastMonthArr, projection 
} from "./forecast.js";
import { 
    handleOpenError 
} from "../functions/error.js";
import { 
    expensesTaxArr, ytdExpensesValue 
} from "./expense.js";

let monthCallList = [];
let unsubCallsTot = 0;
let unsubCallList = [];

const countUnSubCalls = async () => {
    try {
        const params = new URLSearchParams();
        params.append("call_submitted", "false");
        const response = await fetch(`${siteUrl}/calls/count?${params}`, {
            method: "GET",
            credentials: "include",
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.error) return console.log(jsonData.error);

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        unsubCallsTot = jsonData;
        unsubTot.textContent = jsonData;
        if (jsonData > 0) {
            unsubView.classList.remove('hide');
        } else {
            unsubView.classList.add('hide');
            unsubViewBtn.classList.remove('hide');
            unsubHideBtn.classList.add('hide');
            unsubCont.classList.add('hide');
        }
    } catch (error) {
        console.log(error);
    }
}

const handleViewBtn = () => {
    unsubViewBtn.classList.add('hide');
    unsubHideBtn.classList.remove('hide');
    if (unsubCallList.length === 0) getUnSubCalls();
    unsubCont.classList.remove('hide');
}

const handleHideBtn = () => {
    unsubHideBtn.classList.add('hide');
    unsubViewBtn.classList.remove('hide');
    unsubCont.classList.add('hide');
}

const getUnSubCalls = async () => {
    try {
        const params = new URLSearchParams();
        params.append("call_submitted", "false");
        const response = await fetch(`${siteUrl}/calls?${params}`, {
            method: "GET",
            credentials: "include",
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.error) return console.log(jsonData.error);

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        unsubCallList = jsonData;
        generateUnsubCalls();

    } catch (error) {
        console.log(error);
    }
}

const renderInvoice = () => {
    invoiceCont.innerHTML = '';
    let invoiceTotal = 0;
    if (forecastMonthArr.length === 0) return;
    forecastMonthArr.forEach((type) => {
        const invoiceSubTotal = Math.floor((type.call_num * type.call_value) / 100);
        invoiceTotal += invoiceSubTotal;
        const invItem = document.createElement('div');
        invItem.classList.add('inv-item');
        const invCat = document.createElement('div');
        invCat.classList.add('inv-cat');
        invCat.textContent = type.call_type;
        const invSubItem = document.createElement('div');
        invSubItem.classList.add('inv-sub-item');
        const invNum = document.createElement('div');
        invNum.classList.add('inv-num');
        invNum.textContent = type.call_num;
        const invVal = document.createElement('div');
        invVal.classList.add('inv-val');
        invVal.textContent = `£${invoiceSubTotal}.00`;
        invSubItem.appendChild(invNum);
        invSubItem.appendChild(invVal);
        invItem.appendChild(invCat);
        invItem.appendChild(invSubItem);
        invoiceCont.appendChild(invItem);
    })
    const invItem = document.createElement('div');
    invItem.classList.add('inv-item');
    const invCat = document.createElement('div');
    invCat.classList.add('inv-cat');
    const invSubItem = document.createElement('div');
    invSubItem.classList.add('inv-sub-item');
    const invNum = document.createElement('div');
    invNum.classList.add('inv-num');
    invNum.textContent = 'Total';
    const invVal = document.createElement('div');
    invVal.classList.add('inv-val');
    invVal.textContent = `£${invoiceTotal}.00`;
    invSubItem.appendChild(invNum);
    invSubItem.appendChild(invVal);
    invItem.appendChild(invCat);
    invItem.appendChild(invSubItem);
    invoiceCont.appendChild(invItem);
}

const renderExpenses = () => {
    expenseSummary.innerHTML = '';
    let expensesTotal = 0;
    if (expensesTaxArr.length === 0) return;
    expensesTaxArr.forEach((type) => {
        const invoiceSubTotal = type.expense_value / 100;
        expensesTotal += invoiceSubTotal;
        const invItem = document.createElement('div');
        invItem.classList.add('inv-item');
        const invCat = document.createElement('div');
        invCat.classList.add('inv-cat');
        invCat.textContent = type.expense_type;
        const invSubItem = document.createElement('div');
        invSubItem.classList.add('inv-sub-item');
        const invNum = document.createElement('div');
        invNum.classList.add('inv-num');
        invNum.textContent = type.expense_num;
        const invVal = document.createElement('div');
        invVal.classList.add('inv-val');
        invVal.textContent = `£${invoiceSubTotal.toFixed(2)}`;
        invSubItem.appendChild(invNum);
        invSubItem.appendChild(invVal);
        invItem.appendChild(invCat);
        invItem.appendChild(invSubItem);
        expenseSummary.appendChild(invItem);
    })
    const invItem = document.createElement('div');
    invItem.classList.add('inv-item');
    const invCat = document.createElement('div');
    invCat.classList.add('inv-cat');
    const invSubItem = document.createElement('div');
    invSubItem.classList.add('inv-sub-item');
    const invNum = document.createElement('div');
    invNum.classList.add('inv-num');
    invNum.textContent = 'Total';
    const invVal = document.createElement('div');
    invVal.classList.add('inv-val');
    invVal.textContent = `£${expensesTotal.toFixed(2)}`;
    invSubItem.appendChild(invNum);
    invSubItem.appendChild(invVal);
    invItem.appendChild(invCat);
    invItem.appendChild(invSubItem);
    expenseSummary.appendChild(invItem);
}

const renderTax = () => {
    let ytdMonth;
    switch (monthArrIndex) {
        case 0:
            ytdMonth = 10;
            break;
        case 1:
            ytdMonth = 11;
            break
        case 2:
            ytdMonth = 12;
            break
        case 3:
            ytdMonth = 1;
            break
        case 4:
            ytdMonth = 2;
            break
        case 5:
            ytdMonth = 3;
            break
        case 6:
            ytdMonth = 4;
            break
        case 7:
            ytdMonth = 5;
            break
        case 8:
            ytdMonth = 6;
            break
        case 9:
            ytdMonth = 7;
            break
        case 10:
            ytdMonth = 8;
            break
        case 11:
            ytdMonth = 9;
            break
    }
    const expenses = (ytdExpensesValue / ytdMonth) * 12;
    const profit = projection - (expenses / 100);
    const higherRate = profit - 50270;
    let higherRateTax = 0;
    if (higherRate > 0) higherRateTax = (higherRate / 100) * 42;
    let lowerRate = 37700;
    if (profit < 50270) lowerRate = profit - 12570;
    let lowerRateTax = 0;
    if (profit > 12570) lowerRateTax = (lowerRate / 100) * 26;
    const totalTaxValue = Math.floor(higherRateTax + lowerRateTax);
    const monthTaxValue = Math.floor(totalTaxValue / 12);
    
    const ytdTaxValue = Math.floor((totalTaxValue / 12) * ytdMonth);
    monthTax.textContent = `£${monthTaxValue}.00`;
    ytdTax.textContent = `£${ytdTaxValue}.00`;
    totalTax.textContent = `£${totalTaxValue}.00`;
}

const generateCallList = () => {
    nameList.innerHTML = '';
    if (monthCallList.length === 0) return;
    monthCallList.forEach((call) => {
        getTime(call.call_time);
        const listItem = document.createElement('li');
        listItem.textContent = `${displayDate} ${currentTime} - ${call.call_name} - ${call.call_type}`;
        nameList.appendChild(listItem);
    })
}

const getMonthCallList = async () => {
    try {
        let year = partOne;
        const month = monthArrIndex + 1;
        const monthStart = 1;
        if (monthArrIndex < 3) year = partTwo;
        const monthEnd = new Date(year, month, 0).getDate();
        const start_date = `${year}-${month}-${monthStart} 00:00`;
        const end_date = `${year}-${month}-${monthEnd} 23:59`;
        const params = new URLSearchParams();
        params.append("start_date", start_date);
        params.append("end_date", end_date);
        params.append("call_submitted", "true");
        params.append("submitted_date", "true");
        const response = await fetch(`${siteUrl}/calls?${params}`, {
            method: "GET",
            credentials: "include",
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.error) return console.log(jsonData.error);

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        monthCallList = jsonData;
        generateCallList();

    } catch (error) {
        console.log(error);
    }
}

export { getUnSubCalls, countUnSubCalls, getMonthCallList, renderInvoice, renderExpenses, renderTax, unsubCallList, handleViewBtn, handleHideBtn, monthCallList }