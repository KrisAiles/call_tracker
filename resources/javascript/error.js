import { 
    errorCont, errorBd, errorBdMsg
} from "./variables.js";

const handleOpenError = (msg) => {
    errorBdMsg.textContent = msg;
    errorCont.classList.remove('hide');
    errorBd.classList.remove('hide');
}

const handleCloseError = () => {
    window.location.reload();
}

export { handleOpenError, handleCloseError }