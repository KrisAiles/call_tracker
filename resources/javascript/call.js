import { 
    siteUrl, callCont, addCall, editCall, addCallName, addCallDate, addCallTime, 
    addCallType, addCallSubmitted, editCallName, editCallDate, editCallTime, editCallType, editCallSubmitted, 
    callContainer, editSubOptn, addSubOptn, callEditError, callAddError, getCallDate, confirmDeleteCont,
    addSubDate, editSubDate, unsubCont
} from "./variables.js";
import { 
    handleAuthError 
} from "./headings.js";
import { 
    verifyName 
} from "./functions.js";
import { 
    getYtdCalls 
} from "./forecast.js";
import { 
    getUnSubCalls, countUnSubCalls, unsubCallList 
} from "./reports.js";
import { 
    handleOpenError 
} from "./error.js";

let callList = [];
let callTypes = [];
let currentDate;
let callHour;
let callMinute;
let currentTime;
let timePlusOne;
let currentCallId;
let displayDate;
let previousCalltime;
let previousCallType;
let previousCallName;
let previousSubmitted;
let previousSubmittedDate;

const getTime = (time) => {
    let today;
    if (time) {
        today = new Date(time);
    } else {
        today = new Date();
    }    
    let currentDay = today.getDate();
    if (currentDay < 10) {
        currentDay = `0${currentDay}`;
    } else {
        currentDay = String(currentDay);
    }
    let currentMonth = today.getMonth();
    currentMonth += 1;
    if (currentMonth < 10) {
        currentMonth = `0${currentMonth}`;
    } else {
        currentMonth = String(currentMonth);
    }
    let currentYear = today.getFullYear();
    currentYear = String(currentYear);
    currentDate = `${currentYear}-${currentMonth}-${currentDay}`;
    displayDate = `${currentDay}/${currentMonth}/${currentYear}`;
    callHour = today.getHours();
    let currentHour = today.getHours();
    if (currentHour < 10) {
        currentHour = `0${currentHour}`;
    } else {
        currentHour = String(currentHour);
    }
    let hourPlusOne = today.getHours();
    hourPlusOne += 1;
    if (hourPlusOne > 23) hourPlusOne = 0;
    if (hourPlusOne < 10) {
        hourPlusOne = `0${hourPlusOne}`;
    } else {
        hourPlusOne = String(hourPlusOne);
    }
    callMinute = today.getMinutes();
    let currentMinute = today.getMinutes();
    if (currentMinute < 10) {
        currentMinute = `0${currentMinute}`;
    } else {
        currentMinute = String(currentMinute);
    }
    currentTime = `${currentHour}:${currentMinute}`;
    timePlusOne = `${hourPlusOne}:${currentMinute}`;
}

const decreaseDate = () => {
    const inpString = getCallDate.value;
    const inpStringArr = inpString.split('-');
    let inpYear = Number(inpStringArr[0]);
    let inpMonth = Number(inpStringArr[1]);
    let inpDay = Number(inpStringArr[2]);

    inpDay--;
    if (inpDay <= 0) {
        inpMonth--;
        if (inpMonth <= 0) {
            inpMonth = 12;
            inpYear--;
        }
        inpDay = new Date(inpYear, inpMonth, 0).getDate();
    }

    if (inpDay < 10) inpDay = `0${inpDay}`;
    if (inpMonth < 10) inpMonth = `0${inpMonth}`;

    getCallDate.value = `${inpYear}-${inpMonth}-${inpDay}`;
    getCallsByDate();
}

const increaseDate = () => {
    const inpString = getCallDate.value;
    const inpStringArr = inpString.split('-');
    let inpYear = Number(inpStringArr[0]);
    let inpMonth = Number(inpStringArr[1]);
    let inpDay = Number(inpStringArr[2]);
    let lastDay = new Date(inpYear, inpMonth, 0).getDate();

    inpDay++;
    if (inpDay > lastDay) {
        inpMonth++;
        if (inpMonth > 12) {
            inpMonth = 1;
            inpYear++;
        }
        inpDay = 1;
    }

    if (inpDay < 10) inpDay = `0${inpDay}`;
    if (inpMonth < 10) inpMonth = `0${inpMonth}`;

    getCallDate.value = `${inpYear}-${inpMonth}-${inpDay}`;
    getCallsByDate();
}

const getCallTypes = async () => {
    try {
        if (callTypes.length > 0) return;
        const response = await fetch(`${siteUrl}/calls/call-types`, {
            method: "GET",
            credentials: "include",
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        callTypes = jsonData;

    } catch (error) {
        console.log(error);
    }
}

const generateCallTypes = async (el, id) => {
    await getCallTypes();
    let optnType = 'Call type...';
    let optnVal = '';
    let optnEl = document.createElement('option');
    optnEl.textContent = optnType;
    optnEl.value = optnVal;
    optnEl.disabled = true;
    if (!id) optnEl.selected = true;
    el.appendChild(optnEl);
    for (let i = 0; i < callTypes.length; i++) {
        optnType = callTypes[i].call_type;
        optnVal = callTypes[i].call_type_id;
        optnEl = document.createElement('option');
        optnEl.textContent = optnType;
        optnEl.value = optnVal;
        if (id && callTypes[i].call_type_id === id) optnEl.selected = true;
        el.appendChild(optnEl);
    }
}

const handleOpenCallAdd = () => {
    getTime();
    generateCallTypes(addCallType, null);
    addCallDate.value = currentDate;
    addCallTime.value = currentTime;
    callCont.classList.remove('hide');
    addCall.classList.remove('hide');
}

const handleCallAddSub = () => {
    addSubDate.value = addCallDate.value;
    if (addCallSubmitted.value === 'true') addSubDate.classList.remove('hide');
    if (addCallSubmitted.value === 'false') addSubDate.classList.add('hide');
}

const handleCallAddDate = () => {
    addSubDate.value = addCallDate.value;
}

const handleCloseCallAdd = () => {
    callCont.classList.add('hide');
    addCall.classList.add('hide');
    addSubDate.classList.add('hide')
    addCallType.innerHTML = '';
    addCallName.value = '';
    addCallDate.value = '';
    addCallTime.value = '';
    addSubOptn.selected = true;
    addCallName.classList.remove('error-input');
    callAddError.textContent = '';
    addCallSubmitted.classList.remove('error-input');
    callAddError.textContent = '';
    addCallType.classList.remove('error-input');
    callAddError.textContent = '';
}

const handleCallEditSub = () => {
    editSubDate.value = editCallDate.value;
    if (editCallSubmitted.value === 'true') editSubDate.classList.remove('hide');
    if (editCallSubmitted.value === 'false') editSubDate.classList.add('hide');
}

const handleCallEditDate = () => {
    editSubDate.value = editCallDate.value;
}

const handleCloseCallEdit = () => {
    callCont.classList.add('hide');
    editCall.classList.add('hide');
    editCallName.value = '';
    editCallDate.value = '';
    editCallTime.value = '';
    editCallType.innerHTML = '';
    editSubOptn.selected = true;
    currentCallId = '';
    editCallName.classList.remove('error-input');
    callEditError.textContent = '';
}

const handleConfirmCallDelete = () => {
    confirmDeleteCont.classList.remove('hide');
}

const handleCancelCallDelete = () => {
    confirmDeleteCont.classList.add('hide');
}

const handleCallDelete = async () => {
    try {
        const response = await fetch(`${siteUrl}/calls/${currentCallId}`, {
            method: "DELETE",
            credentials: "include",
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        handleCancelCallDelete();
        handleCloseCallEdit();
        getCallsByDate();
        getYtdCalls();
        countUnSubCalls();
        getUnSubCalls();

    } catch (error) {
        console.log(error);
    }
}

const generateCalls = () => {
    callContainer.innerHTML = '';
    let callEndHour = 7;
    let callEndMinute = 30;
    if (callList.length === 0) return;
    callList.forEach(call => {
        getTime(call.call_time);
        const minutesEnd = (callEndHour * 60) + callEndMinute;
        const minutesStart = (callHour * 60) + callMinute;
        const callGap = minutesStart - minutesEnd;
        const emptyDivHeight = callGap * 2;
        const emptyCallDiv = document.createElement('div');
        emptyCallDiv.classList.add('call-item-empty');
        emptyCallDiv.style.height = `${emptyDivHeight}px`;
        callContainer.appendChild(emptyCallDiv);
        const callDiv = document.createElement('div');
        callDiv.classList.add('call-item');
        if (!call.call_submitted) callDiv.classList.add('not-submitted');
        const namePara = document.createElement('span');
        namePara.textContent = call.call_name;
        const timePara = document.createElement('span');
        timePara.textContent = `${currentTime} - ${timePlusOne}`;
        const typePara = document.createElement('span');
        typePara.textContent = call.call_type;
        callDiv.addEventListener('click', () => {
            previousCalltime = call.call_time;
            previousCallType = call.call_type_id;
            previousCallName = call.call_name;
            previousSubmitted = call.call_submitted;
            previousSubmittedDate = call.submitted_date;
            currentCallId = call.call_info_id;
            getTime(call.call_time);
            generateCallTypes(editCallType, call.call_type_id);
            editCallName.value = call.call_name;
            editCallDate.value = currentDate;
            editCallTime.value = currentTime;
            editCallSubmitted.value = String(call.call_submitted);
            getTime(call.submitted_date);
            editSubDate.value = currentDate;
            if (editCallSubmitted.value === 'true') editSubDate.classList.remove('hide');
            if (editCallSubmitted.value === 'false') editSubDate.classList.add('hide');
            callCont.classList.remove('hide');
            editCall.classList.remove('hide');
        })
        callDiv.appendChild(namePara);
        callDiv.appendChild(timePara);
        callDiv.appendChild(typePara);
        callContainer.appendChild(callDiv);
        callEndHour = callHour + 1;
        callEndMinute = callMinute;
    });
}

const generateUnsubCalls = () => {
    unsubCont.innerHTML = '';
    if (unsubCallList.length === 0) return;
    unsubCallList.forEach(call => {
        getTime(call.call_time);
        const callDiv = document.createElement('div');
        callDiv.classList.add('unsub-call-item');
        if (!call.call_submitted) callDiv.classList.add('not-submitted');
        const namePara = document.createElement('span');
        namePara.textContent = call.call_name;
        const timePara = document.createElement('span');
        timePara.textContent = `${currentTime} - ${timePlusOne}`;
        const typePara = document.createElement('span');
        typePara.textContent = call.call_type;
        callDiv.addEventListener('click', () => {
            previousCalltime = call.call_time;
            previousCallType = call.call_type_id;
            previousCallName = call.call_name;
            previousSubmitted = call.call_submitted;
            previousSubmittedDate = call.submitted_date;
            currentCallId = call.call_info_id;
            getTime(call.call_time);
            generateCallTypes(editCallType, call.call_type_id);
            editCallName.value = call.call_name;
            editCallDate.value = currentDate;
            editCallTime.value = currentTime;
            editCallSubmitted.value = String(call.call_submitted);
            getTime(call.submitted_date);
            editSubDate.value = currentDate;
            if (editCallSubmitted.value === 'true') editSubDate.classList.remove('hide');
            if (editCallSubmitted.value === 'false') editSubDate.classList.add('hide');
            callCont.classList.remove('hide');
            editCall.classList.remove('hide');
        })
        callDiv.appendChild(namePara);
        callDiv.appendChild(timePara);
        callDiv.appendChild(typePara);
        unsubCont.appendChild(callDiv);
    });
}

const handleAddCall = async () => {
    try {
        const call_type_id = addCallType.value;
        let call_submitted;
        const call_name = addCallName.value.trim();
        let get_submitted_date;
        if (verifyName(call_name)) {
            addCallName.classList.remove('error-input');
            callAddError.textContent = '';
        } else {
            addCallName.classList.add('error-input');
            return callAddError.textContent = 'Invalid name.';
        }
        if (addCallType.value) {
            addCallType.classList.remove('error-input');
            callAddError.textContent = '';
        } else {
            addCallType.classList.add('error-input');
            return callAddError.textContent = 'Must select call type.';
        }
        if (addCallSubmitted.value) {
            addCallSubmitted.classList.remove('error-input');
            callAddError.textContent = '';
        } else {
            addCallSubmitted.classList.add('error-input');
            return callAddError.textContent = 'Must select call submitted.';
        }        
        if (addCallSubmitted.value === 'true') {
            call_submitted = true;
            get_submitted_date = new Date(`${addSubDate.value} ${addCallTime.value}`);
        } 
        if (addCallSubmitted.value === 'false') {
            call_submitted = false;
            get_submitted_date = new Date(`${addCallDate.value} ${addCallTime.value}`);
        } 
        const submitted_date = get_submitted_date;
        const get_call_time = new Date(`${addCallDate.value} ${addCallTime.value}`);
        const call_time = get_call_time;
        const body = { call_type_id, call_submitted, call_name, call_time, submitted_date };
        const response = await fetch(`${siteUrl}/calls`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(body)
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.error) return callAddError.textContent = jsonData.error;

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        handleCloseCallAdd();
        getCallsByDate();
        getYtdCalls();
        countUnSubCalls();
        getUnSubCalls();
        
    } catch (error) {
        console.log(error);
    }
}

const handleUpdateCall = async () => {
    try {
        const id = currentCallId;
        const call_type_id = editCallType.value;
        let call_submitted;
        let get_submitted_date;
        if (editCallSubmitted.value === 'true') {
            call_submitted = true;
            get_submitted_date = new Date(`${editSubDate.value} ${editCallTime.value}`);
        } 
        if (editCallSubmitted.value === 'false') {
            call_submitted = false;
            get_submitted_date = new Date(`${editCallDate.value} ${editCallTime.value}`);
        } 
        const call_name = editCallName.value.trim();
        if (verifyName(call_name)) {
            editCallName.classList.remove('error-input');
            callEditError.textContent = '';
        } else {
            editCallName.classList.add('error-input');
            return callEditError.textContent = 'Invalid name.';
        }
        const submitted_date = get_submitted_date;
        const get_call_time = new Date(`${editCallDate.value} ${editCallTime.value}`);
        const call_time = get_call_time;
        const prevCallTime = new Date(previousCalltime);
        const prevSubDate = new Date(previousSubmittedDate);
        if (prevCallTime.getTime() === call_time.getTime() && previousCallType === call_type_id && previousCallName === call_name && previousSubmitted === call_submitted && prevSubDate.getTime() === submitted_date.getTime()) return handleCloseCallEdit();
        const body = { call_type_id, call_submitted, call_name, call_time, submitted_date };
        const response = await fetch(`${siteUrl}/calls/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(body)
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.error) return callEditError.textContent = jsonData.error;

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        handleCloseCallEdit();
        getCallsByDate();
        getYtdCalls();
        countUnSubCalls();
        getUnSubCalls();

    } catch (error) {
        console.log(error);
    }
}

const getCallsByDate = async () => {
    try {
        getTime(getCallDate.value)
        const start_date = `${currentDate} 00:00`;
        const end_date = `${currentDate} 23:59`;
        const params = new URLSearchParams();
        params.append("start_date", start_date);
        params.append("end_date", end_date);
        const response = await fetch(`${siteUrl}/calls?${params}`, {
            method: "GET",
            credentials: "include",
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.error) return console.log(jsonData.error);

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        callList = jsonData;
        generateCalls();

    } catch (error) {
        console.log(error);
    }
}

const getTodaysCalls = async () => {
    try {
        getTime();
        getCallDate.value = currentDate;
        const start_date = `${currentDate} 00:00`;
        const end_date = `${currentDate} 23:59`;
        const params = new URLSearchParams();
        params.append("start_date", start_date);
        params.append("end_date", end_date);
        const response = await fetch(`${siteUrl}/calls?${params}`, {
            method: "GET",
            credentials: "include",
        });

        const jsonData = await response.json();

        if (jsonData.authErrorMessage) return handleAuthError();

        if (jsonData.error) return console.log(jsonData.error);

        if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

        callList = jsonData;
        generateCalls();

    } catch (error) {
        console.log(error);
    }
}

export { 
    callList, callTypes, handleOpenCallAdd, handleCloseCallAdd, handleCloseCallEdit, handleUpdateCall, handleAddCall, getTodaysCalls, 
    handleCallDelete, decreaseDate, increaseDate, getCallsByDate, handleCancelCallDelete, handleConfirmCallDelete, getCallTypes, 
    handleCallAddSub, handleCallEditSub, handleCallEditDate, handleCallAddDate, currentTime, displayDate, getTime, generateUnsubCalls
}