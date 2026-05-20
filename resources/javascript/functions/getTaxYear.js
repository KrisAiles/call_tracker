let partOne;
let partTwo;
let monthArrIndex;
let forecastHolInp = 0;
const monthArr = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
let tWD = 0;
let wDTD = 0;
let wDR = 0;
let mTWD = 0;
let mWDTD = 0;

const getTaxYear = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    monthArrIndex = currentMonth;
    const currentDate = today.getDate();
    if (currentMonth < 4) {
        partOne = currentYear - 1;
        partTwo = currentYear;
    } else {
        partOne = currentYear;
        partTwo = currentYear + 1;
    }
    getWorkingDaysYear();
    getWorkingDaysMonth();
}

const getWorkingDaysYear = () => {
    tWD = 0;
    for (let i = 0; i < 12; i++) {
        let startDay = 1;
        let year = partTwo;
        //if (i === 3) startDay = 6;
        if (i > 2) year = partOne;
        for (let j = startDay; j < new Date(year, i + 1, 0).getDate() + 1; j++) {
            //console.log('ran');
            if (new Date(year, i, j).getDay() > 0) tWD++;
        }
        /*if (i === 2) {
            for (let k = 1; k < 6; k++) {
                //console.log('ran')
                if (new Date(partTwo, 3, k).getDay() > 0) tWD++;
            }
        }*/
    }
    getWorkingDaysYTD();
    //console.log('year total working days' + tWD);
}

const getWorkingDaysYTD = () => {
    wDTD = 0;
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    if (month < 3 && partTwo === year || month > 2 && partOne === year) {
        if (month < 3) {
            for (let i = 3; i < 12; i++) {
                let startDay = 1;
                //if (i === 3) startDay = 6;
                for (let j = startDay; j < new Date(year - 1, i + 1, 0).getDate() + 1; j++) {
                    //console.log('ran');
                    if (new Date(year, i, j).getDay() > 0) wDTD++;
                }
            }
            for (let i = 0; i < month; i ++) {
                let startDay = 1;
                for (let j = startDay; j < new Date(year, i + 1, 0).getDate() + 1; j++) {
                    //console.log('ran');
                    if (new Date(year, i, j).getDay() > 0) wDTD++;
                }
            }
            for (let i = 1; i < day; i++) {
                //console.log('ran');
                if (new Date(year, month, i).getDay() > 0) wDTD++;
            }
        } else {
            for (let i = 3; i < month; i ++) {
                let startDay = 1;
                //if (i === 3) startDay = 6;
                for (let j = startDay; j < new Date(year, i + 1, 0).getDate() + 1; j++) {
                    //console.log('ran');
                    if (new Date(year, i, j).getDay() > 0) wDTD++;
                }
            }
            let startDay = 1;
            //if (month === 3) startDay = 6;
            for (let i = startDay; i < day; i++) {
                //console.log('ran');
                if (new Date(year, month, i).getDay() > 0) wDTD++;
            }
        }
    } else {
        wDTD = tWD;
    }
    //console.log('year WDTD' + wDTD);
}

const getWorkingDaysMonth = () => {
    mTWD = 0;
    let year = partOne;
    let startDay = 1;
    let month = monthArrIndex;
    //if (month === 3) startDay = 6;
    if (month < 3) year = partTwo;

    for (let i = startDay; i < new Date(year, month + 1, 0).getDate() + 1; i++) {
        //console.log('ran');
        if (new Date(year, month, i).getDay() > 0) mTWD++;
    }
    /*if (month === 2) {
        for (let j = 1; j < 6; j++) {
            //console.log('also ran')
            if (new Date(partOne, 3, j).getDay() > 0) mTWD++;
        }
    }*/
    getWorkingDaysMTD();
    //console.log('month total working days' + mTWD)
}

const getWorkingDaysMTD = () => {
    mWDTD = 0;
    let yearInp = partOne;
    let monthInp = monthArrIndex;
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    if (month === monthInp && year === yearInp) {
       /*if (month === 3) {
            for (let i = 6; i < day; i++) {
                //console.log('also ran')
                if (new Date(year, 3, i).getDay() > 0) mWDTD++;
            }          
        } else {*/
            for (let i = 1; i < day; i++) {
                if (new Date(year, month, i).getDay() > 0) mWDTD++;
            } 
        //} 
    } else {
        mWDTD = mTWD;
    }
    //console.log(mWDTD);
}


//getWorkingDaysYear();
//getWorkingDaysMonth();

const decreaseYear = () => {
    partOne--;
    partTwo--;
    getWorkingDaysYear();
    getWorkingDaysMonth();
}

const increaseYear = () => {
    partOne++;
    partTwo++;
    getWorkingDaysYear();
    getWorkingDaysMonth();
}

const decreaseMonth = () => {
    monthArrIndex--;
    if (monthArrIndex < 0) monthArrIndex = 11;
    getWorkingDaysMonth();
}

const increaseMonth = () => {
    monthArrIndex++;
    if (monthArrIndex >11) monthArrIndex = 0;
    getWorkingDaysMonth();
}

export { 
    partOne, partTwo, monthArrIndex, monthArr, getTaxYear, decreaseYear, increaseYear, decreaseMonth, increaseMonth, tWD, wDTD, mTWD, mWDTD, 
    getWorkingDaysYear, getWorkingDaysMonth 
}