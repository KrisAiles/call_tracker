import { 
    loginSubmit, closeEdit, submitEdit, openEdit, closeEditPassword, submitEditPassword, openEditPassword, logout, accountHd, callsHd, 
    expensesHd, forecastHd, reportsHd, closeCallAdd, openCallAdd, closeCallEdit, submitCallEdit, submitCallAdd, deleteCall, getCallDate, 
    decreaseCallDate, increaseCallDate, confirmDeleteCall, cancelDeleteCall, decreaseForecastYear, increaseForecastYear, decreaseForecastHol, 
    increaseForecastHol, decreaseForecastMonth, increaseForecastMonth, decreaseYearHol, increaseYearHol, addCallSubmitted, editCallSubmitted, 
    editCallDate, addCallDate, unsubViewBtn, unsubHideBtn, topBtn
} from "./variables.js";
import { 
    userProfile, getUser, loginUser, handleOpenEdit, handleCloseEdit, updateUser, handleClosePassword, handleOpenPassword, updatePassword, 
    handleLogout  
} from "./user.js";
import { 
    handleOpenCallAdd, handleCloseCallAdd, handleCloseCallEdit, handleUpdateCall, handleAddCall, handleCallDelete, decreaseDate, 
    increaseDate, getCallsByDate, handleCancelCallDelete, handleConfirmCallDelete, getTodaysCalls, handleCallAddSub, handleCallEditSub, 
    handleCallAddDate, handleCallEditDate
} from "./call.js";
import { 
    switchTab, handleAuthError 
} from "./headings.js";
import { 
    setTaxYear, decreaseTaxYear, increaseTaxYear, increaseHoliday, decreaseHoliday, decreaseTaxMonth, increaseTaxMonth, getYtdCalls,
    increaseYearHoliday, decreaseYearHoliday 
} from "./forecast.js";
import { 
    countUnSubCalls, getMonthCallList, handleViewBtn, handleHideBtn 
} from "./reports.js";
import { 
    handleTopBtn 
} from "./top.js";

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
decreaseForecastYear.addEventListener('click', decreaseTaxYear);
increaseForecastYear.addEventListener('click', increaseTaxYear);
decreaseForecastHol.addEventListener('click', decreaseHoliday);
increaseForecastHol.addEventListener('click', increaseHoliday);
decreaseForecastMonth.addEventListener('click', decreaseTaxMonth);
increaseForecastMonth.addEventListener('click', increaseTaxMonth);
decreaseYearHol.addEventListener('click', decreaseYearHoliday);
increaseYearHol.addEventListener('click', increaseYearHoliday);
addCallSubmitted.addEventListener('change', handleCallAddSub);
editCallSubmitted.addEventListener('change', handleCallEditSub);
addCallDate.addEventListener('input', handleCallAddDate);
editCallDate.addEventListener('input', handleCallEditDate);
unsubViewBtn.addEventListener('click', handleViewBtn);
unsubHideBtn.addEventListener('click', handleHideBtn);
topBtn.addEventListener('click', handleTopBtn);
window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        topBtn.classList.remove("hide");
    } else {
        topBtn.classList.add("hide");
    }
};

const getData = async () => {
    if (!localStorage.getItem("logged-in")) return handleAuthError();
    if (!userProfile) getUser();
    getTodaysCalls();
    setTaxYear();
    getYtdCalls();
    countUnSubCalls();
    getMonthCallList();
}

getData();
console.log(new Date('2026-05-20T14:00:00.000Z'));

export { getData };