function sanitizeText(str) {
    const trimmedStr = str.trim();
    const textRegex = /[<>`"'$+]/g;
    if (textRegex.test(trimmedStr)) {
        const originalStr = trimmedStr;
        const escapeStr = originalStr
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/`/g, '&#96;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/[$]/g, '&#36;')
        .replace(/[+]/g, '&#43;');

        return escapeStr;
    } else {
        return trimmedStr;
    }
}

function verifyBoolean(bol) {
    if (typeof bol === 'boolean') {
        return true;
    } else {
        return false;
    }
}

function verifyDate(dateStr) {
    return !isNaN(new Date(dateStr));
}

function verifyEmail(str) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(str);
}

function verifyName(str) {
        const nameRegex = /^[A-Za-z\(\)\'\-]+( [A-Za-z\(\)\'\-]+)*$/;
        return nameRegex.test(str);
}

function verifyNumber(num) {
    if (typeof num === 'number') {
        if (num >= 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function verifyPassword(str) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,30}$/;
        return passwordRegex.test(str);
}

function verifyString(str) {
    if (typeof str === 'string') {
        return true;
    } else {
        return false;
    }
}

function verifyTimestamp(input) {
    const regex = /[A-Za-z]+,\s\d\d\s[A-Za-z]+\s[0-9]+\s[0-9]+:[0-9]+:[0-9]+\s[A-Za-z]+/i;
    return regex.test(input);
}

function verifyUuidFormat(input) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    return uuidRegex.test(input);
}

export { sanitizeText, verifyBoolean, verifyDate, verifyEmail, verifyName, verifyNumber, verifyPassword, verifyString, verifyTimestamp, verifyUuidFormat };