const siteUrl = 'https://server.daily-planner.uk';
const cardDisplay = document.getElementById('card-display');
const loginCont = document.getElementById('login-cont');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginSubmit = document.getElementById('login-submit');
const loginError = document.getElementById('login-error');
const bdDisplay = document.getElementsByClassName('bd');
const hdDisplay = document.getElementsByClassName('hd');
const accountBd = document.getElementById('account-bd');
const callsBd = document.getElementById('calls-bd');
const expensesBd = document.getElementById('expenses-bd');
const forecastBd = document.getElementById('forecast-bd');
const reportsBd = document.getElementById('reports-bd');
const accountHd = document.getElementById('account-hd');
const callsHd = document.getElementById('calls-hd');
const expensesHd = document.getElementById('expenses-hd');
const forecastHd = document.getElementById('forecast-hd');
const reportsHd = document.getElementById('reports-hd');
const accountHeading = document.getElementById('account-heading');
const callContainer = document.getElementById('call-container');
const editCont = document.getElementById('edit-cont');
const editUser = document.getElementById('edit-user');
const closeEdit = document.getElementById('close-edit');
const submitEdit = document.getElementById('submit-edit');
const openEdit = document.getElementById('open-edit');
const openEditPassword = document.getElementById('open-edit-password');
const firstNameTarget = document.getElementById('first-name-target');
const lastNameTarget = document.getElementById('last-name-target');
const emailTarget = document.getElementById('email-target');
const editFirstName = document.getElementById('edit-first-name');
const editLastName = document.getElementById('edit-last-name');
const editEmail = document.getElementById('edit-email');
const editPassword = document.getElementById('edit-password');
const existingPassword = document.getElementById('existing-password');
const newPassword = document.getElementById('new-password');
const closeEditPassword = document.getElementById('close-edit-password');
const submitEditPassword = document.getElementById('submit-edit-password');
const logout = document.getElementById('logout');
const hdCont = document.getElementById('hd-cont');
const passwordError = document.getElementById('password-error');
const userError = document.getElementById('user-error');
const callCont = document.getElementById('call-cont');
const addCall = document.getElementById('add-call');
const editCall = document.getElementById('edit-call');
const addCallName = document.getElementById('add-call-name');
const addCallDate = document.getElementById('add-call-date');
const addCallTime = document.getElementById('add-call-time');
const addCallType = document.getElementById('add-call-type');
const addCallSubmitted = document.getElementById('add-call-submitted');
const closeCallAdd = document.getElementById('close-call-add');
const openCallAdd = document.getElementById('open-call-add');
const submitCallAdd = document.getElementById('submit-call-add');
const editCallName = document.getElementById('edit-call-name');
const editCallDate = document.getElementById('edit-call-date');
const editCallTime = document.getElementById('edit-call-time');
const editCallType = document.getElementById('edit-call-type');
const editCallSubmitted = document.getElementById('edit-call-submitted');
const closeCallEdit = document.getElementById('close-call-edit');
const submitCallEdit = document.getElementById('submit-call-edit');
const addSubOptn = document.getElementById('add-sub-optn');
const editSubOptn = document.getElementById('edit-sub-optn');
const callEditError = document.getElementById('call-edit-error');
const callAddError = document.getElementById('call-add-error');
const deleteCall = document.getElementById('delete-call');
const getCallDate = document.getElementById('get-call-date');
const decreaseCallDate = document.getElementById('decrease-call-date');
const increaseCallDate = document.getElementById('increase-call-date');
const confirmDeleteCont = document.getElementById('confirm-delete-cont');
const confirmDeleteCall = document.getElementById('confirm-delete-call');
const cancelDeleteCall = document.getElementById('cancel-delete-call');
const forecastYear = document.getElementById('forecast-year');
const forecastMonth = document.getElementById('forecast-month');
const forecastHol = document.getElementById('forecast-hol');
const decreaseForecastYear = document.getElementById('decrease-forecast-year');
const increaseForecastYear = document.getElementById('increase-forecast-year');
const decreaseForecastMonth = document.getElementById('decrease-forecast-month');
const increaseForecastMonth = document.getElementById('increase-forecast-month');
const decreaseForecastHol = document.getElementById('decrease-forecast-hol');
const increaseForecastHol = document.getElementById('increase-forecast-hol');
const yearTot = document.getElementById('year-tot');
const monthTot = document.getElementById('month-tot');
const yearAv = document.getElementById('year-av');
const yearReq = document.getElementById('year-req');
const yearPro = document.getElementById('year-pro');
const forecastYearHol = document.getElementById('forecast-year-hol');
const decreaseYearHol = document.getElementById('decrease-year-hol');
const increaseYearHol = document.getElementById('increase-year-hol');
const monthAv = document.getElementById('month-av');
const monthReq = document.getElementById('month-req');
const monthPro = document.getElementById('month-pro');
const addSubDate = document.getElementById('add-submitted-date');
const editSubDate = document.getElementById('edit-submitted-date');
const unsubTot = document.getElementById('unsub-tot');
const unsubView = document.getElementById('unsub-view');
const unsubCont = document.getElementById('unsub-cont');
const unsubViewBtn = document.getElementById('unsub-view-btn');
const unsubHideBtn = document.getElementById('unsub-hide-btn');
const nameList = document.getElementById('name-list');
const invoiceCont = document.getElementById('invoice-cont');
const monthTax = document.getElementById('month-tax');
const ytdTax = document.getElementById('ytd-tax');
const totalTax = document.getElementById('total-tax');
const topBtn = document.getElementById('top-btn');

export { 
    siteUrl, cardDisplay, loginCont, loginEmail, loginPassword, loginSubmit, loginError, bdDisplay, hdDisplay, accountBd, callsBd, 
    accountHd, callsHd, expensesHd, forecastHd, reportsHd, expensesBd, forecastBd, reportsBd, accountHeading, 
    callContainer, editCont, editUser, closeEdit, submitEdit, openEdit, openEditPassword, firstNameTarget, lastNameTarget, 
    emailTarget, editFirstName, editLastName, editEmail, editPassword, existingPassword, newPassword, closeEditPassword, 
    submitEditPassword, logout, hdCont, passwordError, userError, callCont, addCall, editCall, addCallName, addCallDate, addCallTime, 
    addCallType, addCallSubmitted, closeCallAdd, openCallAdd, submitCallAdd, editCallName, editCallDate, editCallTime, editCallType, 
    editCallSubmitted, closeCallEdit, submitCallEdit, addSubOptn, editSubOptn, callEditError, callAddError, deleteCall, 
    getCallDate, decreaseCallDate, increaseCallDate, confirmDeleteCall, confirmDeleteCont, cancelDeleteCall, forecastYear, forecastMonth, 
    forecastHol, decreaseForecastYear, increaseForecastYear, decreaseForecastHol, increaseForecastHol, yearTot, decreaseForecastMonth, 
    increaseForecastMonth, monthTot, yearAv, yearReq, yearPro, forecastYearHol, decreaseYearHol, increaseYearHol, monthAv, monthReq, monthPro, 
    addSubDate, editSubDate, unsubTot, unsubView, unsubCont, unsubViewBtn, unsubHideBtn, nameList, invoiceCont, monthTax, ytdTax, totalTax, 
    topBtn
};