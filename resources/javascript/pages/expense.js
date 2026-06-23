import { 
    siteUrl, addExpenseType, addExpenseDate, expenseCont, addExpense, addExpenseDesc, expenseAddError, 
    addExpenseValue, expenseItemCont, monthTotal, editExpenseType, editExpenseDesc, editExpenseDate, editExpenseValue, 
    editExpense, expenseEditError, confirmDeleteExpenseCont, expenseList
} from "../variables/variables.js";
import { 
    getTime, currentDate, displayDate 
} from "./call.js";
import { 
    handleAuthError 
} from "../functions/headings.js";
import { 
    handleOpenError 
} from "../functions/error.js";
import { 
    verifyName, verifyNumber 
} from "../functions/functions.js";
 import { 
    partOne, partTwo, monthArrIndex
} from "../functions/getTaxYear.js";
import { 
    renderExpenses, renderTax 
} from "./reports.js";

let expensesTaxArr = [];
let expensesMonthArr = [];
let expenseTypes = [];
let previousExpenseDate;
let previousExpenseType;
let previousExpenseDesc;
let previousExpenseValue;
let currentExpenseId;
let ytdExpensesValue;

const getExpenseTypes = async () => {
    try {
        if (expenseTypes.length > 0) return;
        const response = await fetch(`${siteUrl}/expenses/expense-types`, {
            method: "GET",
            credentials: "include",
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        expenseTypes = jsonData;

    } catch (error) {
        console.log(error);
    }
}

const generateExpenseTypes = async (el, id) => {
    await getExpenseTypes();
    let optnType = 'Expense type...';
    let optnVal = '';
    let optnEl = document.createElement('option');
    optnEl.textContent = optnType;
    optnEl.value = optnVal;
    optnEl.disabled = true;
    if (!id) optnEl.selected = true;
    el.appendChild(optnEl);
    for (let i = 0; i < expenseTypes.length; i++) {
        optnType = expenseTypes[i].expenses_type;
        optnVal = expenseTypes[i].expenses_type_id;
        optnEl = document.createElement('option');
        optnEl.textContent = optnType;
        optnEl.value = optnVal;
        if (id && expenseTypes[i].expenses_type_id === id) optnEl.selected = true;
        el.appendChild(optnEl);
    }
}

const handleOpenExpenseAdd = () => {
    getTime();
    generateExpenseTypes(addExpenseType, null);
    addExpenseDate.value = currentDate;
    expenseCont.classList.remove('hide');
    addExpense.classList.remove('hide');
}

const handleCloseExpenseAdd = () => {
    expenseCont.classList.add('hide');
    addExpense.classList.add('hide');
    addExpenseType.innerHTML = '';
    addExpenseDesc.value = '';
    addExpenseDate.value = '';
    addExpenseValue.value = '';
    addExpenseDesc.classList.remove('error-input');
    addExpenseType.classList.remove('error-input');
    addExpenseValue.classList.remove('error-input');
    expenseAddError.textContent = '';
}

const handleCloseExpenseEdit = () => {
    expenseCont.classList.add('hide');
    editExpense.classList.add('hide');
    editExpenseType.innerHTML = '';
    editExpenseDesc.value = '';
    editExpenseDate.value = '';
    editExpenseValue.value = '';
    editExpenseDesc.classList.remove('error-input');
    editExpenseType.classList.remove('error-input');
    editExpenseValue.classList.remove('error-input');
    expenseEditError.textContent = '';
}

const addExpenseDescError = () => {
    if (verifyName(addExpenseDesc.value.trim())) {
        addExpenseDesc.classList.remove('error-input');
        expenseAddError.textContent = '';
        return true;
    } else {
        addExpenseDesc.classList.add('error-input');
        expenseAddError.textContent = 'Invalid description.';
        return false;
    }
}

const addExpenseTypeError = () => {
    if (addExpenseType.value) {
        addExpenseType.classList.remove('error-input');
        expenseAddError.textContent = '';
        return true;
    } else {
        addExpenseType.classList.add('error-input');
        expenseAddError.textContent = 'Must select expense type.';
        return false;
    }   
}

const addExpenseValueError = () => {
    if (verifyNumber(Number(addExpenseValue.value) * 100) && Number(addExpenseValue.value) * 100 > 0) {
        addExpenseValue.classList.remove('error-input');
        expenseAddError.textContent = '';
        return true;
    } else {
        addExpenseValue.classList.add('error-input');
        expenseAddError.textContent = 'Invalid value.';
        return false;
    }
}

const handleAddExpense = async () => {
    try {        
        if (addExpenseDescError()) {
            addExpenseDesc.removeEventListener('input', addExpenseDescError);
        } else {
            return addExpenseDesc.addEventListener('input', addExpenseDescError);
        }
        if (addExpenseTypeError()) {
            addExpenseType.removeEventListener('change', addExpenseTypeError);
        } else {
            return addExpenseType.addEventListener('change', addExpenseTypeError);
        }
        if (addExpenseValueError()) {
            addExpenseValue.removeEventListener('input', addExpenseValueError);
        } else {
            return addExpenseValue.addEventListener('input', addExpenseValueError);
        }
        const expenses_type_id = addExpenseType.value;
        const expenses_description = addExpenseDesc.value.trim();
        const expenses_value = Number(addExpenseValue.value) * 100;
        const expenses_date = new Date(`${addExpenseDate.value} 12:00`);
        const body = { expenses_type_id, expenses_date, expenses_description, expenses_value };
        const response = await fetch(`${siteUrl}/expenses`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(body)
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.error) return callAddError.textContent = jsonData.error;

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        handleCloseExpenseAdd();
        getMonthExpenses();
        
    } catch (error) {
        console.log(error);
    }
}

const getMonthExpenses = async () => {
    try {
        await getExpenseTypes();
        let mtdYear = partOne;
        const mtdMonth = monthArrIndex + 1;
        const mtdStartDate = 1;
        if (monthArrIndex < 3) mtdYear = partTwo;
        const mtdEndDate = new Date(mtdYear, mtdMonth, 0).getDate();
        const start_date = `${mtdYear}-${mtdMonth}-${mtdStartDate} 00:00`;
        const end_date = `${mtdYear}-${mtdMonth}-${mtdEndDate} 23:59`;
        const params = new URLSearchParams();
        params.append("start_date", start_date);
        params.append("end_date", end_date);
        const response = await fetch(`${siteUrl}/expenses?${params}`, {
            method: "GET",
            credentials: "include",
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.error) return console.log(jsonData.error);

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        expensesMonthArr = jsonData;
        generateExpenses();
        generateExpensesSummary();
        generateExpenseList();
        renderExpenses();
        getYTDExpensesValue();

    } catch (error) {
        console.log(error);
    }
}

const generateExpenses = () => {
    expenseItemCont.innerHTML = '';
    let monthTotalValue = 0;
    if (expensesMonthArr.length === 0) return monthTotal.textContent = `£${monthTotalValue / 100}.00`;
    expensesMonthArr.forEach(expense => {
        getTime(expense.expenses_date);
        monthTotalValue += expense.expenses_value;     
        const expenseDiv = document.createElement('div');
        expenseDiv.classList.add('expense-item');
        const descriptionPara = document.createElement('span');
        descriptionPara.textContent = expense.expenses_description;
        const typePara = document.createElement('span');
        typePara.textContent = expense.expenses_type;
        const datePara = document.createElement('span');
        datePara.textContent = displayDate;
        const valuePara = document.createElement('span');
        const expenseValue = expense.expenses_value / 100;
        valuePara.textContent = `£${expenseValue.toFixed(2)}`;
        expenseDiv.addEventListener('click', () => {
            previousExpenseDate = expense.expenses_date;
            previousExpenseType = expense.expenses_type_id;
            previousExpenseDesc = expense.expenses_description;
            previousExpenseValue = expense.expenses_value;
            currentExpenseId = expense.expenses_id;
            getTime(expense.expenses_date);
            generateExpenseTypes(editExpenseType, expense.expenses_type_id);
            editExpenseDesc.value = expense.expenses_description;
            editExpenseDate.value = currentDate;
            const editValue = expense.expenses_value / 100;
            editExpenseValue.value = editValue.toFixed(2);
            expenseCont.classList.remove('hide');
            editExpense.classList.remove('hide');
        })
        expenseDiv.appendChild(descriptionPara);
        expenseDiv.appendChild(datePara);
        expenseDiv.appendChild(typePara);
        expenseDiv.appendChild(valuePara);
        expenseItemCont.appendChild(expenseDiv);
    });
    const monthValue = monthTotalValue / 100;
    monthTotal.textContent = `£${monthValue.toFixed(2)}`;
}

const editExpenseDescError = () => {
    if (verifyName(editExpenseDesc.value.trim())) {
        editExpenseDesc.classList.remove('error-input');
        expenseEditError.textContent = '';
        return true;
    } else {
        editExpenseDesc.classList.add('error-input');
        expenseEditError.textContent = 'Invalid description.';
        return false;
    }
}

const editExpenseValueError = () => {
    if (verifyNumber(Number(editExpenseValue.value) * 100) && Number(editExpenseValue.value) * 100 > 0) {
        editExpenseValue.classList.remove('error-input');
        expenseEditError.textContent = '';
        return true;
    } else {
        editExpenseValue.classList.add('error-input');
        expenseEditError.textContent = 'Invalid value.';
        return false;
    }
}

const handleUpdateExpense = async () => {
    try {
        if (editExpenseDescError()) {
            editExpenseDesc.removeEventListener('input', editExpenseDescError);
        } else {
            return editExpenseDesc.addEventListener('input', editExpenseDescError);
        }
        if (editExpenseValueError()) {
            editExpenseValue.removeEventListener('input', editExpenseValueError);
        } else {
            return editExpenseValue.addEventListener('input', editExpenseValueError);
        }
        const id = currentExpenseId;
        const expenses_type_id = editExpenseType.value;
        const expenses_value = Number(editExpenseValue.value) * 100;
        const expenses_description = editExpenseDesc.value.trim();
        const expenses_date = new Date(`${editExpenseDate.value} 12:00`);
        const prevExpenseDate = new Date(previousExpenseDate);
        if (prevExpenseDate.getTime() === expenses_date.getTime() && previousExpenseType === expenses_type_id && previousExpenseDesc === expenses_description && previousExpenseValue === expenses_value) return handleCloseExpenseEdit();
        const body = { expenses_type_id, expenses_date, expenses_description, expenses_value };
        const response = await fetch(`${siteUrl}/expenses/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(body)
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.error) return expenseEditError.textContent = jsonData.error;

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        handleCloseExpenseEdit();
        getMonthExpenses();

    } catch (error) {
        console.log(error);
    }
}

const handleConfirmExpenseDelete = () => {
    confirmDeleteExpenseCont.classList.remove('hide');
}

const handleCancelExpenseDelete = () => {
    confirmDeleteExpenseCont.classList.add('hide');
}

const handleExpenseDelete = async () => {
    try {
        const response = await fetch(`${siteUrl}/expenses/${currentExpenseId}`, {
            method: "DELETE",
            credentials: "include",
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        handleCancelExpenseDelete();
        handleCloseExpenseEdit();
        getMonthExpenses();

    } catch (error) {
        console.log(error);
    }
}

const generateExpensesSummary = async () => {
    try {
        expensesTaxArr = [];
        let expenseNum = 0;
        let expenseVal = 0;
        for (let i = 0; i < expenseTypes.length; i ++) {
            expenseNum = 0;
            expenseVal = 0;
            for (let j = 0; j < expensesMonthArr.length; j++) {
                if (expensesMonthArr[j].expenses_type_id === expenseTypes[i].expenses_type_id) {
                    expenseNum += 1;
                    expenseVal += expensesMonthArr[j].expenses_value;
                }                
            }
            const forecastCallObj = {
                expense_num: expenseNum,
                expense_value: expenseVal,
                expense_type: expenseTypes[i].expenses_type
            };
            expensesTaxArr.push(forecastCallObj);
        }

    } catch (error) {
        console.log(error);
    }
}

const generateExpenseList = () => {
    try {
        expenseList.innerHTML = '';
        if (expensesMonthArr.length === 0) return;
        expensesMonthArr.forEach((expense) => {
            getTime(expense.expenses_date);
            const value = expense.expenses_value / 100;
            const listItem = document.createElement('li');
            listItem.textContent = `${displayDate} - ${expense.expenses_description} - ${expense.expenses_type} - £${value.toFixed(2)}`;
            expenseList.appendChild(listItem);
        })
    } catch (error) {
        console.log(error);
    }
}

const getYTDExpensesValue = async () => {
    try {
        const start_date = `${partOne}-${'04'}-${'01'} 00:00`;
        const end_date = `${partTwo}-${'03'}-${'31'} 23:59`;
        const params = new URLSearchParams();
        params.append("start_date", start_date);
        params.append("end_date", end_date);
        const response = await fetch(`${siteUrl}/expenses/value?${params}`, {
            method: "GET",
            credentials: "include",
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.error) return console.log(jsonData.error);

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        ytdExpensesValue = jsonData.sum === null ? 0 : Number(jsonData.sum);
        renderTax();

    } catch (error) {
        console.log(error);
    }
}

export { 
    handleOpenExpenseAdd, handleCloseExpenseAdd, handleAddExpense, getMonthExpenses, handleUpdateExpense, handleCloseExpenseEdit, 
    handleCancelExpenseDelete, handleConfirmExpenseDelete, handleExpenseDelete, expensesTaxArr, ytdExpensesValue
 }