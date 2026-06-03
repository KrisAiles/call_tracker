import { 
    siteUrl, cardDisplay, loginCont, loginEmail, loginPassword, loginError, bdDisplay, accountHeading, editCont, editUser, 
    firstNameTarget, lastNameTarget, emailTarget, editFirstName, editLastName, editEmail, editPassword, existingPassword, 
    newPassword, hdCont, passwordError, userError 
} from "./variables.js";
import { 
    verifyName, verifyEmail, verifyPassword, 
} from "./functions.js";
import { 
    getData 
} from "./index.js";
import { 
    handleAuthError 
} from "./headings.js";
import { 
    handleOpenError 
} from "./error.js";

const loggedIn = localStorage.getItem("logged-in");
let userProfile;

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
    passwordError.textContent = '';
    existingPassword.classList.remove('error-input');
    newPassword.classList.remove('error-input');
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
                for (let i = 0; i < bdDisplay.length; i++) {
                    if (bdDisplay[i].id === 'account-bd') bdDisplay[i].classList.remove('hide');
                }
                userProfile = jsonData;
                accountHeading.textContent = `Welcome back ${userProfile.first_name}.`;
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
            loginError.textContent = '';
            loginCont.classList.remove('hide');
            cardDisplay.classList.remove('hide');
        }
           
    } catch (error) {
        console.log(error);
    }
}

const loginUser = async () => {
    try {
        const email = loginEmail.value;
        const password = loginPassword.value;
        if (verifyEmail(email)) {
            loginEmail.classList.remove('error-input');
            loginError.textContent = '';
        } else {
            loginEmail.classList.add('error-input');
            return loginError.textContent = 'Invalid email address.';
        }
        if (verifyPassword(password)) {
            loginPassword.classList.remove('error-input');
            loginError.textContent = '';
        } else {
            loginPassword.classList.add('error-input');
            return loginError.textContent = 'Invalid password.';
        }
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
        accountHeading.textContent = `Welcome back ${userProfile.first_name}.`;
        firstNameTarget.textContent = userProfile.first_name;
        lastNameTarget.textContent = userProfile.last_name;
        emailTarget.textContent = userProfile.email;
        for (let i = 0; i < bdDisplay.length; i++) {
            if (bdDisplay[i].id === 'account-bd') bdDisplay[i].classList.remove('hide');
        }
        hdCont.classList.remove('hide');
        loginCont.classList.add('hide');
        loginEmail.value = '';
        loginPassword.value = '';
        loginError.textContent = '';
        loginEmail.classList.remove('error-input');
        loginPassword.classList.remove('error-input');

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
        accountHeading.textContent = `Welcome back ${userProfile.first_name}.`;
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
        loginCont.classList.remove('hide');
        cardDisplay.classList.remove('hide');
        accountHeading.textContent = '';
        firstNameTarget.textContent = '';
        lastNameTarget.textContent = '';
        emailTarget.textContent = '';
        loginEmail.value = '';
        loginPassword.value = '';
        loginError.textContent = '';
    } catch (error) {
        console.log(error);
    }
}

export { 
    userProfile, getUser, loginUser, handleOpenEdit, handleCloseEdit, updateUser, 
    handleClosePassword, handleOpenPassword, updatePassword, handleLogout, loggedIn 
}