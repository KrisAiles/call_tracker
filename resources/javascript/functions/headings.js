import { 
    hdDisplay, bdDisplay, hdCont, loginError, loginCont, cardDisplay, logoutCont
} from "../variables/variables.js";

const switchTab = (e) => {
    const id = e.target.id;
    const bdId = id.split('-')[0] + '-bd';
    for (let i = 0; i < hdDisplay.length; i++) {
        if (hdDisplay[i].id !== id) {
            hdDisplay[i].classList.add('hd-inactive');
        } else {
            hdDisplay[i].classList.remove('hd-inactive');
        }
    }
    for (let i = 0; i < bdDisplay.length; i++) {
        if (bdDisplay[i].id !== bdId) {
            bdDisplay[i].classList.add('hide');
        } else {
            bdDisplay[i].classList.remove('hide');
        }
    }
}

const handleAuthError = () => {
    localStorage.removeItem("logged-in");
    for (let i = 0; i < bdDisplay.length; i++) {
        bdDisplay[i].classList.add('hide');
    }
    hdCont.classList.add('hide');
    logoutCont.classList.add('hide');
    loginError.textContent = '';
    loginCont.classList.remove('hide');
    cardDisplay.classList.remove('hide');
}

export { switchTab, handleAuthError };