import { 
    siteUrl, forecastYear, forecastMonth, forecastHol, yearTot, monthTot, yearAv, yearReq, yearPro, forecastYearHol, monthAv, monthReq, monthPro
 } from "./variables.js";
 import { 
    partOne, partTwo, monthArrIndex, monthArr, getTaxYear, decreaseYear, increaseYear, decreaseMonth, increaseMonth, tWD, wDTD, mTWD, mWDTD 
} from "./functions/getTaxYear.js";
import { 
    callTypes, getCallTypes 
} from "./call.js";
import { 
    handleAuthError 
} from "./headings.js";
import { 
    renderInvoice, getMonthCallList, renderTax 
} from "./reports.js";

let forecastYearHolInp = 25;
let forecastHolInp = 0;
let forecastYearArr = [];
let forecastMonthArr = [];
let YTD = 0;
let projection;

const setTaxYear = () => {
    getTaxYear();
    forecastYear.textContent = `${partOne} / ${partTwo}`;
    forecastMonth.textContent = monthArr[monthArrIndex];
    forecastYearHol.textContent = forecastYearHolInp;
    forecastHol.textContent = forecastHolInp;
}

const decreaseTaxYear = () => {
    decreaseYear();
    forecastYear.textContent = `${partOne} / ${partTwo}`;
    getYtdCalls();
}

const increaseTaxYear = () => {
    increaseYear();
    forecastYear.textContent = `${partOne} / ${partTwo}`;
    getYtdCalls();
}

const increaseYearHoliday = () => {
    forecastYearHolInp++;
    forecastYearHol.textContent = forecastYearHolInp;
    renderYTD();
}

const decreaseYearHoliday = () => {
    if (forecastYearHolInp <= 0) return;
    forecastYearHolInp--;
    forecastYearHol.textContent = forecastYearHolInp;
    renderYTD();
}

const increaseHoliday = () => {
    forecastHolInp++;
    forecastHol.textContent = forecastHolInp;
    renderMTD();
}

const decreaseHoliday = () => {
    if (forecastHolInp <= 0) return;
    forecastHolInp--;
    forecastHol.textContent = forecastHolInp;
    renderMTD();
}

const decreaseTaxMonth = () => {
    decreaseMonth();
    forecastMonth.textContent = monthArr[monthArrIndex];
    getMtdCalls();
}

const increaseTaxMonth = () => {
    increaseMonth();
    forecastMonth.textContent = monthArr[monthArrIndex];
    getMtdCalls();
}

const getYtdCalls = async () => {
    try {
        forecastYearArr = [];
        const start_date = `${partOne}-${4}-${1} 00:00`;
        const end_march = new Date(partTwo, 3, 0).getDate();
        let end_date;
        if (new Date().getTime() < new Date(partTwo, 2, end_march, 23, 59).getTime()) {
            end_date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 23:59`;
        } else {
            end_date = `${partTwo}-${3}-${end_march} 23:59`;
        }   
        const params = new URLSearchParams();
        params.append("start_date", start_date);
        params.append("end_date", end_date);
        params.append("call_submitted", "true");
        await getCallTypes();
        for (const type of callTypes) {
            params.delete("call_type_id");
            params.append("call_type_id", type.call_type_id);
            const response = await fetch(`${siteUrl}/calls/count?${params}`, {
                method: "GET",
                credentials: "include",
            });

            const jsonData = await response.json();

            if (jsonData.authErrorMessage) return handleAuthError();

            if (jsonData.error) {
                return console.log(jsonData.error);
            }

            const forecastCallObj = {
                call_num: jsonData,
                call_value: type.call_value
            };
            forecastYearArr.push(forecastCallObj);
                  
        }
        renderYTD(); 
        getMtdCalls();
        renderInvoice();
        getMonthCallList();
    } catch (error) {
        console.log(error);
    }
}

const getMtdCalls = async () => {
    try {
        forecastMonthArr = [];
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
        params.append("call_submitted", "true");
        await getCallTypes();
        for (const type of callTypes) {
            params.delete("call_type_id");
            params.append("call_type_id", type.call_type_id);
            const response = await fetch(`${siteUrl}/calls/count?${params}`, {
                method: "GET",
                credentials: "include",
            });

            const jsonData = await response.json();

            if (jsonData.authErrorMessage) return handleAuthError();

            if (jsonData.error) {
                return console.log(jsonData.error);
            }

            const forecastCallObj = {
                call_num: jsonData,
                call_value: type.call_value,
                call_type: type.call_type
            };
            forecastMonthArr.push(forecastCallObj);               
        }
        renderMTD();
        renderInvoice();
        getMonthCallList();
    } catch (error) {
        console.log(error);
    }
}

const renderYTD = () => {
    let ytdTotal = 0;
    forecastYearArr.forEach((call) => {
        ytdTotal += call.call_num * call.call_value;
    })
    YTD = ytdTotal / 100;
    const workingDaysAfterHol = tWD - forecastYearHolInp;
    const yearTotal = ytdTotal / 100;
    const yearAverage = yearTotal / wDTD;
    let yearRequired;
    if (tWD === wDTD) {
        yearRequired = 0;
    } else {
        yearRequired = (66000 - yearTotal) / (workingDaysAfterHol - wDTD);
    }    
    const yearProjection = yearAverage * workingDaysAfterHol;
    projection = yearProjection;
    yearTot.textContent = `£${Math.floor(yearTotal)}.00`;
    yearAv.textContent = `£${Math.floor(yearAverage)}.00`;
    yearReq.textContent = `£${Math.floor(yearRequired)}.00`;
    yearPro.textContent = `£${Math.floor(yearProjection)}.00`;
    renderTax();
}

const renderMTD = () => {
    let mtdTotal = 0;
    forecastMonthArr.forEach((call) => {
        mtdTotal += call.call_num * call.call_value;
    })
    const workingDaysAfterHol = mTWD - forecastHolInp;
    const monthTotal = mtdTotal / 100;
    const monthAverage = monthTotal / mWDTD;
    const previousMonths = YTD - monthTotal;
    let monthsLeft;
    if (monthArrIndex < 3) {
        monthsLeft = (3 - (monthArrIndex + 1)) + 1;
    } else {
        monthsLeft = ((11 - monthArrIndex) + 3) + 1;
    }
    const target = Math.floor((66000 - previousMonths) / monthsLeft);
    let monthRequired;
    if (mTWD === mWDTD) {
        monthRequired = 0;
    } else {
        monthRequired = (target - monthTotal) / (workingDaysAfterHol - mWDTD);
    }    
    const monthProjection = monthAverage * workingDaysAfterHol;
    monthTot.textContent = `£${Math.floor(monthTotal)}.00`;
    monthAv.textContent = `£${Math.floor(monthAverage)}.00`;
    monthReq.textContent = `£${Math.floor(monthRequired)}.00`;
    monthPro.textContent = `£${Math.floor(monthProjection)}.00`;    
    renderTax();
}

export { 
    setTaxYear, decreaseTaxYear, increaseTaxYear, increaseHoliday, decreaseHoliday, decreaseTaxMonth, increaseTaxMonth, renderYTD, renderMTD, 
    increaseYearHoliday, decreaseYearHoliday, getYtdCalls, getMtdCalls, forecastMonthArr, projection 
};