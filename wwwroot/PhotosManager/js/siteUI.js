import User from "../../../models/user.js";

let contentScrollPosition = 0;
Init_UI();
let loginMessage = "";
let Email = "";
let EmailError = "";
let Password = "";
let PasswordError = "";
//creation of user
let Name = "";
let NameError = "";
function Init_UI() {
    try {
        renderLoginForm();
    } catch (e) {
        loginMessage = "Le serveur ne repond pas"; 
        renderError(loginMessage);
    }
    //try to login
    $('#loginForm').submit(function (e) { 
        console.log("trying to login");
        e.preventDefault();
        saveUserInput(false);
        //try to login
        login(Email, Password);
    });
    $('#createProfilForm').submit(function (e){
        console.log("trying to create account");
        e.preventDefault();
        saveUserInput();
        let name = $("input[name='Email']").val()
        let user = User(name, Email, Password, 0, Authorizations.user())
        API.register(user);
        console.log("sent email to user " + user.Id);
    })
    //go to creation page
    $('#content').on("click", '#createProfileCmd', async function () {
        console.log("creation profile");
        saveContentScrollPosition();
        renderCreateProfileForm();
        initFormValidation();
        // addConflictValidation("Users", "Name", "createProfileCmd");
        // addConflictValidation("Users", "Email", "createProfileCmd");
    });
    //create profile
    $('#content').on("click", '#saveUserCmd', async function () {
        console.log("saving profile");
        saveUserInput(true);
        // let newUser = new User();
        newUser.Name = Name;
        newUser.Email = Email;
        newUser.Password = Password;
        // API.register(newUser);
    });
    //return to login screen
    $('#content').on("click", '#abortCmd', async function () {
        console.log("login");
        saveContentScrollPosition();
        renderLoginForm();
    });

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering
function showWaitingGif() {
    eraseContent();
    $("#content").append($("<div class='waitingGifcontainer' > <img class='waitingGif' src='images/Loading_icon.gif' /></div > '"));
}
function eraseContent() {
    $("#content").empty();
}
function saveContentScrollPosition() {
    contentScrollPosition = $("#content")[0].scrollTop;
}
function restoreContentScrollPosition() {
    $("#content")[0].scrollTop = contentScrollPosition;
}
function updateHeader(headerTitleFR,headerTitleEN) {
    //TODO : mettre a jour le header
}
function renderAbout() {
    timeout();
    saveContentScrollPosition();
    eraseContent();
    updateHeader("À propos...", "about");

    $("#content").append(
        $(`
            <div class="aboutContainer">
                <h2>Gestionnaire de photos</h2>
                <hr>
                <p>
                    Petite application de gestion de photos multiusagers à titre de démonstration
                    d'interface utilisateur monopage réactive.
                </p>
                <p>
                    Auteur: Nicolas Chourot
                </p>
                <p>
                    Collège Lionel-Groulx, automne 2023
                </p>
            </div>
        `))
}
function renderError(msg) {
    saveContentScrollPosition();
    eraseContent();
    $("#content").append(
        $(`
            <div class="content" style="text-align:center">
                <h3>${loginMessage}</h3>
                <hr>
                <div class="form">
                    <hr>
                    <button class="form-control btn-info" id="loginCmd">Connexion</button>
                </div> 
            </div>
        `))
}
//added
function saveUserInput(isToCreate) {
    Email = $("input[name='Email']").val();
    Password = $(":password").val();
    console.log("Email: "+Email, "Password: "+Password);
    if (isToCreate) {
        Name = $("#Name").val();
        console.log("Name: "+Name);
    }
    
}
//login
function renderLoginForm(loginMessage = "", Email = "", EmailError = "", passwordError = "") {
    saveContentScrollPosition();
    eraseContent();
    $("#content").append(
        $(`
            <div class="content" style="text-align:center">
                <h3>${loginMessage}</h3>
                <form class="form" id="loginForm">
                    <input type='email'
                        name='Email'
                        class="form-control"
                        required
                        RequireMessage = 'Veuillez entrer votre courriel'
                        InvalidMessage = 'Courriel invalide'
                        placeholder="Adresse courriel"
                        value='${Email}'>
                    <span style='color:red'>${EmailError}</span>
                    <input type='password'
                        name='Password'
                        placeholder='Mot de passe'
                        class="form-control"
                        required
                        RequireMessage = 'Veuillez entrer votre mot de passe'>
                    <span style='color:red'>${passwordError}</span>
                    <input type='submit' name='submit' value="Entrer" class="form-control btn-primary">
                </form>
                <div class="form">
                    <hr>
                    <button class="form-control btn-info" id="createProfileCmd">Nouveau compte</button>
                </div>  
            </div>
        `))
}
async function login(email, password) {
    try {
        if(await API.login(email,password)){
        loginMessage = "Success!";
         console.log("success");
    }
     else {
         //TODO : savoir si l'erreur est du courriel ou du mot de passe
         renderError(loginMessage);
         renderLoginForm(loginMessage, Email, "Courriel introuvable", "Mot de passe incorrect");
    }
    } catch (error) {
        loginMessage = "Le serveur ne repond pas"; 
        renderError(loginMessage);
    }
     
}
//create
function renderCreateProfileForm() {
    saveContentScrollPosition();
    eraseContent();
    $("#content").append(
        $(`
            <form class="form" id="createProfilForm"> 
                <fieldset> 
                    <legend>Adresse ce courriel</legend> 
                        <input 
                            type="email" 
                            class="form-control Email" 
                            name="Email" 
                            id="Email" 
                            placeholder="Courriel" 
                            required
                            RequireMessage = ' Veuillez entrer votre courriel'
                            InvalidMessage='Courriel invalide'
                            CustomErrorMessage="Ce courriel est déjà utilisé" />
                        <input 
                            class="form-control MatchedInput" 
                            type="text"
                            matchedInputId="Email" 
                            name="matchedEmail"
                            id="matchedEmail" 
                            placeholder="Vérification" 
                            required
                            RequireMessage='Veuillez entrez de nouveau votre courriel'
                            InvalidMessage="Les courriels ne correspondent pas" />
                </fieldset>
                <fieldset>
                    <legend>Mot de passe</legend>
                        <input 
                            type="password" 
                            class="form-control" 
                            name="Password" 
                            id="Password" 
                            placeholder="Mot de passe"
                            required
                            RequireMessage='Veuillez entrer un mot de passe'
                            InvalidMessage='Mot de passe trop court' />
                        <input 
                            class="form-control MatchedInput" 
                            type="password"
                            matchedInputId="Password"
                            name="matchedPassword"  
                            id="matchedPassword" 
                            placeholder="Vérification" 
                            required
                            InvalidMessage="Ne correspond pas au mot de passe" />
                </fieldset>
                <fieldset>
                    <legend>Nom</legend>
                        <input 
                            type="text" 
                            class="form-control Alpha" 
                            name="Name" 
                            id="Name" 
                            placeholder="Nom" 
                            required
                            RequireMessage='Veuillez entrer votre nom'
                            InvalidMessage='Nom invalide' />
                </fieldset>
                <fieldset>
                    <legend>Avatar</legend>
                    <div class="imageUploader"
                         newImage='true'
                         controlId='Avatar'
                         imageSrc='../images/no-avatar.png'
                        waitingImage="../images/Loading_icon.gif">
                    </div>
                </fieldset>
                <input
                    type='submit'
                    name='submit'
                    id='saveUserCmd'
                    value="Enregistrer"
                    class="form-control btn-primary">
            </form>
            <div class="cancel">
                <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
            </div>
        `))
}
async function createProfile(profile){
    if(await API.register(profile)){
        loginMessage = "Votre compte a ete cree."
        renderLoginForm();
    }
    else {
        renderError("Un probleme est survenu.");
    }
}

