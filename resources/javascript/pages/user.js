import { 
    siteUrl, cardDisplay, loginCont, loginEmail, loginPassword, loginError, bdDisplay, accountHeading, editCont, editUser, 
    firstNameTarget, lastNameTarget, emailTarget, editFirstName, editLastName, editEmail, editPassword, existingPassword, 
    newPassword, hdCont, passwordError, userError, confirmNewPassword, loginPwShow, loginPwHide, exsPwShow, exsPwHide, 
    newPwShow, newPwHide, conPwShow, conPwHide, yearHoliday, forecastYearHol, monthHoliday, 
    holidayItemCont, holidayCont, addHoliday, addHolidayDate, editHoliday, confirmDeleteHolidayCont, 
    editHolidayDate, forecastHol, holidayAddError, holidayEditError, logoutCont  
} from "../variables/variables.js";
import { 
    verifyName, verifyEmail, verifyPassword 
} from "../functions/functions.js";
import { 
    getData 
} from "../index.js";
import { 
    handleAuthError 
} from "../functions/headings.js";
import { 
    handleOpenError 
} from "../functions/error.js";
 import { 
    partOne, partTwo, monthArrIndex
} from "../functions/getTaxYear.js";
import { 
    renderYTD, renderMTD
} from "./forecast.js";
import { 
    getTime, currentDate, displayDate 
} from "./call.js";

const loggedIn = localStorage.getItem("logged-in");
let userProfile;
let welcomeMsg;
let yearHolidayObj;
let yearHolidayTotal = 25;
let monthHolidayTotal = 0;
let currentHolidayId = '';
let previousHolidayDate = '';
let holidayDaysArr = [];
let increaseHolidayTimeout;
let decreaseHolidayTimeout;

const setWelcomeMsg = () => {
    if (userProfile) {
        accountHeading.textContent = `Good ${welcomeMsg}, ${userProfile.first_name}`;
    } else {
        accountHeading.textContent = `Good ${welcomeMsg}`;
    }    
}

const updateWelcomeMsg = () => {
    const timeOfDay = new Date();
    const hourOfDay = timeOfDay.getHours();
    const minsOfHour = timeOfDay.getMinutes();
    const secsOfMin = timeOfDay.getSeconds();
    const hoursToMidnight = 23 - hourOfDay;
    let hoursToSix = 17 - hourOfDay;
    if (hoursToSix < 0) hoursToSix += 24;
    let hoursToMidday = 11 - hourOfDay;
    if (hoursToMidday < 0) hoursToMidday += 24;
    const minsToHour = 59 - minsOfHour;
    const secsToMin = 60 - secsOfMin;    
    const delayHoursMidnight = hoursToMidnight * 60 * 60 * 1000;
    const delayHoursSix = hoursToSix * 60 * 60 * 1000;
    const delayHoursMidday = hoursToMidday * 60 * 60 * 1000;
    const delayMins = minsToHour * 60 * 1000;
    const delaySecs = secsToMin * 1000;
    const delayMsMidnight = delayHoursMidnight + delayMins + delaySecs;
    const delayMsSix = delayHoursSix + delayMins + delaySecs;
    const delayMsMidday = delayHoursMidday + delayMins + delaySecs;

    const welcomeMorning = () => {
        welcomeMsg = 'morning';
        setWelcomeMsg();
    }

    if (hourOfDay < 12) welcomeMorning();

    const welcomeAfternoon = () => {
        welcomeMsg = 'afternoon';
        setWelcomeMsg();
    }

    if (hourOfDay > 11 && hourOfDay < 18) welcomeAfternoon();

    const welcomeEvening = () => {
        welcomeMsg = 'evening';
        setWelcomeMsg();
    }

    if (hourOfDay > 17) welcomeEvening();

    let morningTimeout = setTimeout(() => {
        welcomeMorning();
        console.log('morning timeout' + new Date())
        let morningInterval = setInterval(welcomeMorning, 86400000);
    }, delayMsMidnight);
    let afternoonTimeout = setTimeout(() => {
        welcomeAfternoon();
        console.log('afternoon timeout' + new Date())
        let afternoonInterval = setInterval(welcomeAfternoon, 86400000);
    }, delayMsMidday);
    let eveningTimeout = setTimeout(() => {
        welcomeEvening();
        console.log('evening timeout' + new Date())
        let eveningInterval = setInterval(welcomeEvening, 86400000);
    }, delayMsSix);
}

const handleOpenEdit = () => {
    editPassword.classList.add('hide');
    editUser.classList.remove('hide');
    editCont.classList.remove('hide');
    editFirstName.value = userProfile.first_name;
    editLastName.value = userProfile.last_name;
    editEmail.value = userProfile.email;
}

const handleOpenPassword = () => {
    editUser.classList.add('hide');
    editPassword.classList.remove('hide');
    editCont.classList.remove('hide');
    existingPassword.value = '';
    newPassword.value = '';
    confirmNewPassword.value = '';
    existingPassword.classList.remove('error-input');
    newPassword.classList.remove('error-input');
    confirmNewPassword.classList.remove('error-input');
}

const handleCloseEdit = () => {
    editUser.classList.add('hide');
    editCont.classList.add('hide');
    editFirstName.value = '';
    editLastName.value = '';
    editEmail.value = '';
    userError.textContent = '';
    editFirstName.classList.remove('error-input');
    editLastName.classList.remove('error-input');
    editEmail.classList.remove('error-input');
}

const handleClosePassword = () => {
    editPassword.classList.add('hide');
    editCont.classList.add('hide');
    existingPassword.value = '';
    newPassword.value = '';
    confirmNewPassword.value = '';
    passwordError.textContent = '';
    existingPassword.classList.remove('error-input');
    newPassword.classList.remove('error-input');
    confirmNewPassword.classList.remove('error-input');
    resetShowPassword(existingPassword, exsPwShow, exsPwHide);
    resetShowPassword(newPassword, newPwShow, newPwHide);
    resetShowPassword(confirmNewPassword, conPwShow, conPwHide);
}

/*const handleClickOutside = (e) => {
    if (e.target.id === 'edit-cont') {
        editUser.classList.add('hide');
        editCont.classList.add('hide');
        editFirstName.value = '';
        editLastName.value = '';
        editEmail.value = '';
        editPassword.classList.add('hide');
        existingPassword.value = '';
        newPassword.value = '';
        passwordError.textContent = '';
        existingPassword.classList.remove('error-input');
        newPassword.classList.remove('error-input');
        userError.textContent = '';
        editFirstName.classList.remove('error-input');
        editLastName.classList.remove('error-input');
        editEmail.classList.remove('error-input');
    } else {
        return;
    }
}*/

const handleLoginEnter = (e) => {
    if (e.code === "Enter") loginUser();
}

const getUser = async () => {
    try {
        if (loggedIn === 'true') {
            if (userProfile) return;
            const response = await fetch(`${siteUrl}/users`, {
                method: "GET",
                credentials: "include",
            });

            const jsonData = await response.json();

            if (jsonData.authErrorMessage) {
                handleAuthError();
            } else if (jsonData.errorMessage) {
                handleOpenError(jsonData.errorMessage);
            } else {
                loginCont.classList.add('hide');
                loginEmail.removeEventListener('keyup', handleLoginEnter);
                loginPassword.removeEventListener('keyup', handleLoginEnter);
                for (let i = 0; i < bdDisplay.length; i++) {
                    if (bdDisplay[i].id === 'reports-bd') bdDisplay[i].classList.remove('hide');
                }
                logoutCont.classList.remove('hide');
                userProfile = jsonData;
                setWelcomeMsg();
                firstNameTarget.textContent = userProfile.first_name;
                lastNameTarget.textContent = userProfile.last_name;
                emailTarget.textContent = userProfile.email;
                cardDisplay.classList.remove('hide');   
            } 
        } else {
            for (let i = 0; i < bdDisplay.length; i++) {
                bdDisplay[i].classList.add('hide');
            }
            hdCont.classList.add('hide');
            logoutCont.classList.add('hide');
            loginError.textContent = '';
            loginCont.classList.remove('hide');
            loginEmail.addEventListener('keyup', handleLoginEnter);
            loginPassword.addEventListener('keyup', handleLoginEnter);
            cardDisplay.classList.remove('hide');            
        }
           
    } catch (error) {
        console.log(error);
    }
}

const loginEmailError = () => {
    if (verifyEmail(loginEmail.value)) {
        loginEmail.classList.remove('error-input');
        loginError.textContent = '';
        return true;
    } else {
        loginEmail.classList.add('error-input');
        loginError.textContent = 'Invalid email address.';
        return false;
    }
}

const loginPasswordError = () => {
    if (verifyPassword(loginPassword.value)) {
        loginPassword.classList.remove('error-input');
        loginError.textContent = '';
        return true;
    } else {
        loginPassword.classList.add('error-input');
        loginError.textContent = 'Invalid password.';
        return false;
    }
}

const loginUser = async () => {
    try {        
        if (loginEmailError()) {
            loginEmail.removeEventListener('input', loginEmailError);
        } else {
            return loginEmail.addEventListener('input', loginEmailError);
        }
        if (loginPasswordError()) {
            loginPassword.removeEventListener('input', loginPasswordError);
        } else {
            return loginPassword.addEventListener('input', loginPasswordError);
        }
        const email = loginEmail.value;
        const password = loginPassword.value;
        const body = { email, password };
        const response = await fetch(`${siteUrl}/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(body)
        });

        const jsonData = await response.json();
        
        if (jsonData.error) {
            if (jsonData.error === 'Email does not exist.') loginEmail.classList.add('error-input');
            if (jsonData.error === 'Password not recognised.') loginPassword.classList.add('error-input');
            return loginError.textContent = jsonData.error;
        }

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        userProfile = jsonData;
        localStorage.setItem("logged-in", "true");
        getData();
        firstNameTarget.textContent = userProfile.first_name;
        lastNameTarget.textContent = userProfile.last_name;
        emailTarget.textContent = userProfile.email;
        for (let i = 0; i < bdDisplay.length; i++) {
            if (bdDisplay[i].id === 'account-bd') bdDisplay[i].classList.remove('hide');
        }
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        hdCont.classList.remove('hide');
        logoutCont.classList.remove('hide');
        loginCont.classList.add('hide');
        loginEmail.removeEventListener('keyup', handleLoginEnter);
        loginPassword.removeEventListener('keyup', handleLoginEnter);
        loginEmail.value = '';
        loginPassword.value = '';
        loginError.textContent = '';
        loginEmail.classList.remove('error-input');
        loginPassword.classList.remove('error-input');
        resetShowPassword(loginPassword, loginPwShow, loginPwHide);

    } catch (error) {
        console.log(error);
    }
}

const updateUser = async () => {
    try {
        const first_name = editFirstName.value;
        const last_name = editLastName.value;
        const email = editEmail.value;
        if (verifyName(first_name)) {
            editFirstName.classList.remove('error-input');
            userError.textContent = '';
        } else {
            editFirstName.classList.add('error-input');
            return userError.textContent = 'Invalid first name.';
        }
        if (verifyName(last_name)) {
            editLastName.classList.remove('error-input');
            userError.textContent = '';
        } else {
            editLastName.classList.add('error-input');
            return userError.textContent = 'Invalid last name.';
        }
        if (verifyEmail(email)) {
            editEmail.classList.remove('error-input');
            userError.textContent = '';
        } else {
            editEmail.classList.add('error-input');
            return userError.textContent = 'Invalid email address.';
        }
        const body = { first_name, last_name, email };
        const response = await fetch(`${siteUrl}/users`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(body)
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.error) return userError.textContent = jsonData.error;

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);
        
        userProfile = jsonData;
        setWelcomeMsg();
        firstNameTarget.textContent = userProfile.first_name;
        lastNameTarget.textContent = userProfile.last_name;
        emailTarget.textContent = userProfile.email;
        handleCloseEdit();

    } catch (error) {
        console.log(error);
    }
}

const updatePassword = async () => {
    try {
        const current_password = existingPassword.value;
        const new_password = newPassword.value;        
        if (verifyPassword(current_password)) {
            existingPassword.classList.remove('error-input');
            passwordError.textContent = '';
        } else {
            existingPassword.classList.add('error-input');
            return passwordError.textContent = 'Invalid password.';
        }
        if (verifyPassword(new_password)) {
            newPassword.classList.remove('error-input');
            passwordError.textContent = '';
        } else {
            newPassword.classList.add('error-input');
            return passwordError.textContent = 'Invalid password.';
        }
        if (newPassword.value === confirmNewPassword.value) {
            newPassword.classList.remove('error-input');
            confirmNewPassword.classList.remove('error-input');
            passwordError.textContent = '';
        } else {
            newPassword.classList.add('error-input');
            confirmNewPassword.classList.add('error-input');
            return passwordError.textContent = 'New password does not match.';
        }
        const body = { current_password, new_password };
        const response = await fetch(`${siteUrl}/users/password`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(body)
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();
        
        if (jsonData.error) return passwordError.textContent = jsonData.error;

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        handleClosePassword();

    } catch (error) {
        console.log(error);
    }
}

const handleLogout = async () => {
    try {
        const response = await fetch(`${siteUrl}/users/logout`, {
            method: "POST",
            credentials: "include"
        });
        localStorage.removeItem("logged-in");
        for (let i = 0; i < bdDisplay.length; i++) {
            bdDisplay[i].classList.add('hide');
        }

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();
        
        if (jsonData.error) return passwordError.textContent = jsonData.error;

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);
        
        hdCont.classList.add('hide');
        logoutCont.classList.add('hide');
        loginCont.classList.remove('hide');
        loginEmail.addEventListener('keyup', handleLoginEnter);
        loginPassword.addEventListener('keyup', handleLoginEnter);
        cardDisplay.classList.remove('hide');
        accountHeading.textContent = '';
        firstNameTarget.textContent = '';
        lastNameTarget.textContent = '';
        emailTarget.textContent = '';
        loginEmail.value = '';
        loginPassword.value = '';
        loginError.textContent = '';
        loginEmail.focus();
    } catch (error) {
        console.log(error);
    }
}

const handleShowPassword = (el, show, hide) => {
    if (el.type === 'password') {
        el.type = 'text';
    } else {
        el.type = 'password';
    }
    show.classList.toggle('hide');
    hide.classList.toggle('hide');
}

const resetShowPassword = (el, show, hide) => {
    if (el.type === 'text') el.type = 'password';
    show.classList.remove('hide');
    hide.classList.add('hide');
}

const getYearHoliday = async () => {
    try {
        const holiday_year = partOne;
        const params = new URLSearchParams();
        params.append("holiday_year", holiday_year);
        const response = await fetch(`${siteUrl}/holiday/year?${params}`, {
            method: "GET",
            credentials: "include"
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        yearHolidayObj = jsonData;

        yearHolidayTotal = yearHolidayObj.holiday_total;

        if (holidayDaysArr.length > yearHolidayTotal) yearHolidayTotal = holidayDaysArr.length;
        
        yearHoliday.textContent = yearHolidayTotal;
        forecastYearHol.textContent = yearHolidayTotal;

    } catch (error) {
        console.log(error);
    }
}

const updateYearHoliday = async () => {
    try {
        let jsonData;
        const holiday_total = yearHolidayTotal;
        const holiday_year = partOne;
        if (yearHolidayObj.holiday_id) {
            const id = yearHolidayObj.holiday_id;
            const body = { holiday_total, holiday_year };
            const response = await fetch(`${siteUrl}/holiday/year/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(body)
            });

            jsonData = await response.json();

        } else {
            const body = { holiday_total, holiday_year };
            const response = await fetch(`${siteUrl}/holiday/year`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(body)
            });

            jsonData = await response.json();

        }

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        yearHolidayObj = jsonData;

        yearHolidayTotal = yearHolidayObj.holiday_total;

        if (holidayDaysArr.length > yearHolidayTotal) yearHolidayTotal = holidayDaysArr.length;
        
        yearHoliday.textContent = yearHolidayTotal;
        forecastYearHol.textContent = yearHolidayTotal;

    } catch (error) {
        console.log(error);
    }
}

const delayUpdateHoliday = () => {
    updateYearHoliday();
    renderYTD();
}

const increaseYearHoliday = () => {
    clearTimeout(increaseHolidayTimeout);
    clearTimeout(decreaseHolidayTimeout);
    yearHolidayTotal++;
    yearHoliday.textContent = yearHolidayTotal;
    forecastYearHol.textContent = yearHolidayTotal;
    increaseHolidayTimeout = setTimeout(delayUpdateHoliday, 5000);
}

const decreaseYearHoliday = () => {
    clearTimeout(increaseHolidayTimeout);
    clearTimeout(decreaseHolidayTimeout);
    if (yearHolidayTotal <= 0 || yearHolidayTotal <= holidayDaysArr.length) return;
    yearHolidayTotal--;
    yearHoliday.textContent = yearHolidayTotal;
    forecastYearHol.textContent = yearHolidayTotal;
    decreaseHolidayTimeout = setTimeout(delayUpdateHoliday, 5000);
}

const getHolidayDays = async () => {
    try {
        const start_date = `${partOne}-04-01 00:00`;
        const end_date = `${partTwo}-03-31 23:59`;
        const params = new URLSearchParams();
        params.append("start_date", start_date);
        params.append("end_date", end_date);
        const response = await fetch(`${siteUrl}/holiday/day?${params}`, {
            method: "GET",
            credentials: "include",
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        holidayDaysArr = jsonData;        

        monthHoliday.textContent = holidayDaysArr.length;

        if (holidayDaysArr.length > yearHolidayTotal) {
            yearHolidayTotal = holidayDaysArr.length;     
            yearHoliday.textContent = yearHolidayTotal;
            forecastYearHol.textContent = yearHolidayTotal;
            updateYearHoliday();
            renderYTD();
        }

        getMonthHolidayTotal();
        generateHolidayList();

    } catch (error) {
        console.log(error);
    }
}

const getMonthHolidayTotal = () => {
    monthHolidayTotal = 0;
    holidayDaysArr.forEach(day => {
        const date = new Date(day.holiday_date);
        if (monthArrIndex === date.getMonth()) monthHolidayTotal ++;
    });
    forecastHol.textContent = monthHolidayTotal;
    renderMTD();
}

const handleOpenHolidayAdd = () => {
    getTime();
    addHolidayDate.value = currentDate;
    holidayCont.classList.remove('hide');
    addHoliday.classList.remove('hide');
}

const handleCloseHolidayAdd = () => {
    holidayCont.classList.add('hide');
    addHoliday.classList.add('hide');
    addHolidayDate.value = '';
    holidayAddError.textContent = '';
}

const holidayExists = (holiday_date) => {
    for (let i = 0; i < holidayDaysArr.length; i++) {
        const existingHoliday = new Date(holidayDaysArr[i].holiday_date);
        if (existingHoliday.getTime() === holiday_date.getTime()) return true;
    }
    return false;
}

const handleAddHoliday = async () => {
    try {
        const holiday_date = new Date(`${addHolidayDate.value} 12:00`);
        if (holidayExists(holiday_date)) return holidayAddError.textContent = 'Holiday day already exists.';
        const body = { holiday_date };
        const response = await fetch(`${siteUrl}/holiday/day`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(body)
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.error) return holidayAddError.textContent = jsonData.error;

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        handleCloseHolidayAdd();
        getHolidayDays();

    } catch (error) {
        console.log(error);
    }
}

const generateHolidayList = () => {
    holidayItemCont.innerHTML = '';
    if (holidayDaysArr.length === 0) return;
    holidayDaysArr.forEach(day => {
        getTime(day.holiday_date);
        const holidayDiv = document.createElement('div');
        holidayDiv.classList.add('holiday-item');
        holidayDiv.textContent = displayDate;
        holidayDiv.addEventListener('click', () => {
            getTime(day.holiday_date);
            currentHolidayId = day.holiday_days_id;
            previousHolidayDate = day.holiday_date;
            editHolidayDate.value = currentDate;
            holidayCont.classList.remove('hide');
            editHoliday.classList.remove('hide');
        })
        holidayItemCont.appendChild(holidayDiv);
    })
}

const handleCloseHolidayEdit = () => {
    holidayCont.classList.add('hide');
    editHoliday.classList.add('hide');
    editHolidayDate.value = '';
    holidayEditError.textContent = '';
}

const handleEditHoliday = async () => {
    try {
        const id = currentHolidayId;
        const holiday_date = new Date(`${editHolidayDate.value} 12:00`);
        const previous_holiday_date = new Date(previousHolidayDate);
        if (holiday_date.getTime() === previous_holiday_date.getTime()) return handleCloseHolidayEdit();
        if (holidayExists(holiday_date)) return holidayEditError.textContent = 'Holiday day already exists.';
        const body = { holiday_date };
        const response = await fetch(`${siteUrl}/holiday/day/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(body)
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.error) return holidayEditError.textContent = jsonData.error;

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        handleCloseHolidayEdit();
        getHolidayDays();

    } catch (error) {
        console.log(error);
    }
}

const handleConfirmHolidayDelete = () => {
    confirmDeleteHolidayCont.classList.remove('hide');
}

const handleCancelHolidayDelete = () => {
    confirmDeleteHolidayCont.classList.add('hide');
}

const handleHolidayDelete = async () => {
    try {
        const response = await fetch(`${siteUrl}/holiday/day/${currentHolidayId}`, {
            method: "DELETE",
            credentials: "include",
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        handleCancelHolidayDelete();
        handleCloseHolidayEdit();
        getHolidayDays();

    } catch (error) {
        console.log(error);
    }
}

export { 
    userProfile, getUser, loginUser, handleOpenEdit, handleCloseEdit, updateUser, 
    handleClosePassword, handleOpenPassword, updatePassword, handleLogout, loggedIn, handleShowPassword, 
    handleLoginEnter, updateWelcomeMsg, getYearHoliday, yearHolidayTotal, increaseYearHoliday, decreaseYearHoliday, 
    getHolidayDays, monthHolidayTotal, getMonthHolidayTotal, handleOpenHolidayAdd, handleCloseHolidayAdd, handleAddHoliday, 
    handleEditHoliday, handleCloseHolidayEdit, handleConfirmHolidayDelete, handleCancelHolidayDelete, handleHolidayDelete 
}