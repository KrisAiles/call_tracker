import { 
    siteUrl, forecastYear, forecastMonth, forecastHol, yearTot, monthTot, yearAv, yearReq, yearPro, monthAv, monthReq, 
    monthPro, expenseMonth, reportsMonth, expenseYear, reportsYear, holidayYear
 } from "../variables/variables.js";
 import { 
    partOne, partTwo, monthArrIndex, monthArr, getTaxYear, decreaseYear, increaseYear, decreaseMonth, increaseMonth, tWD, wDTD, mTWD, mWDTD 
} from "../functions/getTaxYear.js";
import { 
    callTypes, getCallTypes 
} from "./call.js";
import { 
    handleAuthError 
} from "../functions/headings.js";
import { 
    renderInvoice, getMonthCallList
} from "./reports.js";
import { 
    handleOpenError 
} from "../functions/error.js";
import { 
    getMonthExpenses
} from "./expense.js";
import { 
    yearHolidayTotal, getYearHoliday, getHolidayDays, getMonthHolidayTotal, monthHolidayTotal
} from "./user.js";

let forecastHolInp = 0;
let forecastYearArr = [];
let forecastMonthArr = [];
let YTD = 0;
let projection;

const setTaxYear = () => {
    getTaxYear();
    setYear();
    forecastMonth.textContent = monthArr[monthArrIndex];
    expenseMonth.textContent = monthArr[monthArrIndex];
    reportsMonth.textContent = monthArr[monthArrIndex];
}

const decreaseTaxYear = () => {
    decreaseYear();
    setYear();
    getYearHoliday();
    getHolidayDays();
    getYtdCalls();    
}

const increaseTaxYear = () => {
    increaseYear();
    setYear();
    getYearHoliday();
    getHolidayDays();
    getYtdCalls();
}

const setYear = () => {
    holidayYear.textContent = `${partOne} / ${partTwo}`;
    forecastYear.textContent = `${partOne} / ${partTwo}`;
    expenseYear.textContent = `${partOne} / ${partTwo}`;
    reportsYear.textContent = `${partOne} / ${partTwo}`;
    getMonthHolidayTotal();
}

const decreaseTaxMonth = () => {
    decreaseMonth();
    forecastMonth.textContent = monthArr[monthArrIndex];
    expenseMonth.textContent = monthArr[monthArrIndex];
    reportsMonth.textContent = monthArr[monthArrIndex];
    getMonthHolidayTotal();
    getMtdCalls();
}

const increaseTaxMonth = () => {
    increaseMonth();
    forecastMonth.textContent = monthArr[monthArrIndex];
    expenseMonth.textContent = monthArr[monthArrIndex];
    reportsMonth.textContent = monthArr[monthArrIndex];
    getMonthHolidayTotal();
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

            if (jsonData.error) return console.log(jsonData.error);

            if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

            const forecastCallObj = {
                call_num: jsonData,
                call_value: type.call_value
            };
            forecastYearArr.push(forecastCallObj);
                  
        }
        renderYTD(); 
        getMtdCalls();
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

            if (jsonData.error) return console.log(jsonData.error);

            if (jsonData.errorMessage) return handleOpenError(jsonData.errorMessage);

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
    const workingDaysAfterHol = Math.max(0, (tWD - yearHolidayTotal));
    const yearTotal = Math.max(0, (ytdTotal / 100));
    const yearAverage = yearTotal / Math.max(1, wDTD);
    let yearRequired;
    if (tWD === wDTD) {
        yearRequired = 0;
    } else {
        yearRequired = Math.max(0, (66000 - yearTotal)) / Math.max(1, (workingDaysAfterHol - wDTD));
    } 
    const yearProjection = yearAverage * workingDaysAfterHol;
    projection = yearProjection;
    yearTot.textContent = `£${Math.floor(yearTotal)}.00`;
    yearAv.textContent = `£${Math.floor(yearAverage)}.00`;
    yearReq.textContent = `£${Math.floor(yearRequired)}.00`;
    yearPro.textContent = `£${Math.floor(yearProjection)}.00`;
}

const renderMTD = () => {
    let mtdTotal = 0;
    forecastMonthArr.forEach((call) => {
        mtdTotal += call.call_num * call.call_value;
    })
    const workingDaysAfterHol = Math.max(0, (mTWD - monthHolidayTotal));
    const monthTotal = Math.max(0, (mtdTotal / 100));
    const monthAverage = monthTotal / Math.max(1, mWDTD);
    const previousMonths = Math.max(0, (YTD - monthTotal));
    let monthsLeft;
    if (monthArrIndex < 3) {
        monthsLeft = (3 - (monthArrIndex));
    } else {
        monthsLeft = ((12 - monthArrIndex) + 3);
    }
    const target = Math.max(0, (Math.floor((66000 - previousMonths) / monthsLeft)));
    let monthRequired = Math.max(0, (target - monthTotal)) / Math.max(1, (workingDaysAfterHol - mWDTD));
    let monthProjection = monthAverage * workingDaysAfterHol;
    if (mTWD === mWDTD) {
        monthRequired = 0;
        monthProjection = monthTotal;
    }
    
    monthTot.textContent = `£${Math.floor(monthTotal)}.00`;
    monthAv.textContent = `£${Math.floor(monthAverage)}.00`;
    monthReq.textContent = `£${Math.floor(monthRequired)}.00`;
    monthPro.textContent = `£${Math.floor(monthProjection)}.00`;    
    getMonthExpenses();
}

export { 
    setTaxYear, decreaseTaxYear, increaseTaxYear, decreaseTaxMonth, increaseTaxMonth, renderYTD, renderMTD, 
    getYtdCalls, getMtdCalls, forecastMonthArr, projection 
};