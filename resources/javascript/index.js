import { 
    loginSubmit, closeEdit, submitEdit, openEdit, closeEditPassword, submitEditPassword, openEditPassword, logout, accountHd, callsHd, 
    expensesHd, forecastHd, reportsHd, closeCallAdd, openCallAdd, closeCallEdit, submitCallEdit, submitCallAdd, deleteCall, getCallDate, 
    decreaseCallDate, increaseCallDate, confirmDeleteCall, cancelDeleteCall, decreaseForecastYear, increaseForecastYear, 
    decreaseForecastMonth, increaseForecastMonth, decreaseYearHol, increaseYearHol, addCallSubmitted, editCallSubmitted, 
    editCallDate, addCallDate, unsubViewBtn, unsubHideBtn, topBtn, closeError, decreaseExpenseMonth, increaseExpenseMonth, expenseMonth, openExpenseAdd, 
    expenseItemCont, decreaseReportsMonth, increaseReportsMonth, reportsMonth, expenseYear, decreaseExpenseYear, increaseExpenseYear, 
    reportsYear, decreaseReportsYear, increaseReportsYear, closeExpenseAdd, submitExpenseAdd, closeExpenseEdit, submitexpenseEdit, deleteExpense, 
    confirmDeleteExpenseCont, confirmDeleteExpense, cancelDeleteExpense, loginPwShow, loginPwHide, exsPwShow, exsPwHide, newPwShow, newPwHide, 
    conPwShow, conPwHide, confirmNewPassword, loginPassword, existingPassword, newPassword, loginEmail, decreaseHolidayYear, increaseHolidayYear, 
    openHolidayAdd, 
    holidayItemCont, holidayCont, addHoliday, addHolidayDate, closeHolidayAdd, submitHolidayAdd, editHoliday, confirmDeleteHolidayCont, 
    confirmDeleteHoliday, cancelDeleteHoliday, editHolidayDate, closeHolidayEdit, submitHolidayEdit, deleteHoliday, viewPdf, downloadPdf 
} from "./variables/variables.js";
import { 
    userProfile, getUser, loginUser, handleOpenEdit, handleCloseEdit, updateUser, handleClosePassword, handleOpenPassword, updatePassword, 
    handleLogout, handleShowPassword, handleLoginEnter, updateWelcomeMsg, getYearHoliday, increaseYearHoliday, decreaseYearHoliday, getHolidayDays, 
    handleOpenHolidayAdd, handleCloseHolidayAdd, handleAddHoliday, handleEditHoliday, handleCloseHolidayEdit, handleConfirmHolidayDelete, 
    handleCancelHolidayDelete, handleHolidayDelete 
} from "./pages/user.js";
import { 
    handleOpenCallAdd, handleCloseCallAdd, handleCloseCallEdit, handleUpdateCall, handleAddCall, handleCallDelete, decreaseDate, 
    increaseDate, getCallsByDate, handleCancelCallDelete, handleConfirmCallDelete, getTodaysCalls, handleCallAddSub, handleCallEditSub, 
    handleCallAddDate, handleCallEditDate
} from "./pages/call.js";
import { 
    switchTab, handleAuthError 
} from "./functions/headings.js";
import { 
    setTaxYear, decreaseTaxYear, increaseTaxYear, decreaseTaxMonth, increaseTaxMonth, getYtdCalls 
} from "./pages/forecast.js";
import { 
    countUnSubCalls, getMonthCallList, handleViewBtn, handleHideBtn 
} from "./pages/reports.js";
import { 
    handleTopBtn 
} from "./functions/top.js";
import { 
    handleCloseError 
} from "./functions/error.js";
import { 
    handleOpenExpenseAdd, handleCloseExpenseAdd, handleAddExpense, getMonthExpenses, handleCloseExpenseEdit, handleUpdateExpense, handleCancelExpenseDelete, 
    handleConfirmExpenseDelete, handleExpenseDelete
} from "./pages/expense.js";
import { generatePdf } from "./functions/pdf.js";

loginEmail.addEventListener('keyup', handleLoginEnter);
loginPassword.addEventListener('keyup', handleLoginEnter);
loginSubmit.addEventListener('click', loginUser);
//editCont.addEventListener('click', handleClickOutside);
closeEdit.addEventListener('click', handleCloseEdit);
openEdit.addEventListener('click', handleOpenEdit);
submitEdit.addEventListener('click', updateUser);
openEditPassword.addEventListener('click', handleOpenPassword);
closeEditPassword.addEventListener('click', handleClosePassword);
submitEditPassword.addEventListener('click', updatePassword);
logout.addEventListener('click', handleLogout);
accountHd.addEventListener('click', switchTab);
callsHd.addEventListener('click', switchTab);
expensesHd.addEventListener('click', switchTab);
forecastHd.addEventListener('click', switchTab);
reportsHd.addEventListener('click', switchTab);
closeCallAdd.addEventListener('click', handleCloseCallAdd);
openCallAdd.addEventListener('click', handleOpenCallAdd);
closeCallEdit.addEventListener('click', handleCloseCallEdit);
submitCallEdit.addEventListener('click', handleUpdateCall);
submitCallAdd.addEventListener('click', handleAddCall);
deleteCall.addEventListener('click', handleConfirmCallDelete);
getCallDate.addEventListener('input', getCallsByDate);
decreaseCallDate.addEventListener('click', decreaseDate);
increaseCallDate.addEventListener('click', increaseDate);
cancelDeleteCall.addEventListener('click', handleCancelCallDelete);
confirmDeleteCall.addEventListener('click', handleCallDelete);
decreaseHolidayYear.addEventListener('click', decreaseTaxYear);
increaseHolidayYear.addEventListener('click', increaseTaxYear);
decreaseForecastYear.addEventListener('click', decreaseTaxYear);
increaseForecastYear.addEventListener('click', increaseTaxYear);
decreaseExpenseYear.addEventListener('click', decreaseTaxYear);
increaseExpenseYear.addEventListener('click', increaseTaxYear);
decreaseReportsYear.addEventListener('click', decreaseTaxYear);
increaseReportsYear.addEventListener('click', increaseTaxYear);
decreaseForecastMonth.addEventListener('click', decreaseTaxMonth);
increaseForecastMonth.addEventListener('click', increaseTaxMonth);
decreaseExpenseMonth.addEventListener('click', decreaseTaxMonth);
increaseExpenseMonth.addEventListener('click', increaseTaxMonth);
decreaseReportsMonth.addEventListener('click', decreaseTaxMonth);
increaseReportsMonth.addEventListener('click', increaseTaxMonth);
decreaseYearHol.addEventListener('click', decreaseYearHoliday);
increaseYearHol.addEventListener('click', increaseYearHoliday);
addCallSubmitted.addEventListener('change', handleCallAddSub);
editCallSubmitted.addEventListener('change', handleCallEditSub);
addCallDate.addEventListener('input', handleCallAddDate);
editCallDate.addEventListener('input', handleCallEditDate);
unsubViewBtn.addEventListener('click', handleViewBtn);
unsubHideBtn.addEventListener('click', handleHideBtn);
topBtn.addEventListener('click', handleTopBtn);
closeError.addEventListener('click', handleCloseError);
openExpenseAdd.addEventListener('click', handleOpenExpenseAdd);
closeExpenseAdd.addEventListener('click', handleCloseExpenseAdd);
submitExpenseAdd.addEventListener('click', handleAddExpense);
closeExpenseEdit.addEventListener('click', handleCloseExpenseEdit);
submitexpenseEdit.addEventListener('click', handleUpdateExpense);
deleteExpense.addEventListener('click', handleConfirmExpenseDelete);
cancelDeleteExpense.addEventListener('click', handleCancelExpenseDelete);
confirmDeleteExpense.addEventListener('click', handleExpenseDelete);
openHolidayAdd.addEventListener('click', handleOpenHolidayAdd);
closeHolidayAdd.addEventListener('click', handleCloseHolidayAdd);
submitHolidayAdd.addEventListener('click', handleAddHoliday);
closeHolidayEdit.addEventListener('click', handleCloseHolidayEdit);
submitHolidayEdit.addEventListener('click', handleEditHoliday);
deleteHoliday.addEventListener('click', handleConfirmHolidayDelete);
cancelDeleteHoliday.addEventListener('click', handleCancelHolidayDelete);
confirmDeleteHoliday.addEventListener('click', handleHolidayDelete);
viewPdf.addEventListener('click', () => {
    generatePdf('view');
});
downloadPdf.addEventListener('click', () => {
    generatePdf('download');
});

loginPwShow.addEventListener('click', () => {
    handleShowPassword(loginPassword, loginPwShow, loginPwHide);
});
loginPwHide.addEventListener('click', () => {
    handleShowPassword(loginPassword, loginPwShow, loginPwHide);
});
exsPwShow.addEventListener('click', () => {
    handleShowPassword(existingPassword, exsPwShow, exsPwHide);
});
exsPwHide.addEventListener('click', () => {
    handleShowPassword(existingPassword, exsPwShow, exsPwHide);
});
newPwShow.addEventListener('click', () => {
    handleShowPassword(newPassword, newPwShow, newPwHide);
});
newPwHide.addEventListener('click', () => {
    handleShowPassword(newPassword, newPwShow, newPwHide);
});
conPwShow.addEventListener('click', () => {
    handleShowPassword(confirmNewPassword, conPwShow, conPwHide);
});
conPwHide.addEventListener('click', () => {
    handleShowPassword(confirmNewPassword, conPwShow, conPwHide);
});

window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        topBtn.classList.remove("hide");
    } else {
        topBtn.classList.add("hide");
    }
};

const getData = async () => {
    if (!localStorage.getItem("logged-in")) return handleAuthError();
    updateWelcomeMsg();
    if (!userProfile) getUser();
    getTodaysCalls();
    setTaxYear();
    getYearHoliday();
    getHolidayDays();
    getYtdCalls();
    countUnSubCalls();
    getMonthCallList();
}

getData();

export { getData };