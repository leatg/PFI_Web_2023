let contentScrollPosition = 0;
Init_UI();
let loginMessage = "";
let Email = "";
let EmailError = "";
let passwordError = "";

function Init_UI() {
    renderLoginForm();
    $('#createProfilCmd').on("click", async function () {
        saveContentScrollPosition();
        renderCreateProfileForm();
    });
    $('#loginCmd').on("click", async function () {
        saveContentScrollPosition();
        renderLoginForm();
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering
function showWaitingGif() {
    eraseContent();
    $("#content").append($("<div class='waitingGifcontainer'><img class='waitingGif' src='images/Loading_icon.gif' /></div>'"));
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
function updateHeader() {
    //todo
}
function renderAbout() {
    timeout();
    saveContentScrollPosition();
    eraseContent();
    UpdateHeader("À propos...", "about");

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
                    <button class="form-control btn-info" id="createProfilCmd">Nouveau compte</button>
                </div>  
            </div>
        `))
}
function renderCreateProfilForm() {
    saveContentsScrollPosition();
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
                        placeholder="adresse de courriel"
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
                    <button class="form-control btn-info" id="createProfilCmd">Nouveau compte</button>
                </div>  
            </div>
        `))
}
function renderError(msg) {
    saveContentsScrollPosition();
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
async function createProfil(profil){
    if(await application.register(profil)){
        loginMessage = "Votre compte a ete cree."
        renderLoginForm();
    }
    else {
        renderError("Un probleme est survenu.");
    }
}

