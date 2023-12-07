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
let Code = "";
let CodeError = "";

//loginMessage = "Votre compte a été créé. Veuillez  prendre vos courriels pour réccupérer votre code de vérification qui vous sera demandé lors de votre prochaine connexion."

function Init_UI() {
  try {
    renderLoginForm();
  } catch (e) {
    console.log(e.message);
  }
  //try to login
  $("#content").on("click","#loginPls",function (e) {
    console.log("trying to login");
    e.preventDefault();
    saveUserInput();
    console.log("Email: "+Email,"Password: "+Password)
    //try to login
    login();
  });
  //go to creation page
  $("#content").on("click", "#createProfileCmd", async function () {
    console.log("creation profile");
    saveContentScrollPosition();
    renderCreateProfile();
    //create profile inside of the render profile
  });
  //return to login screen
  $("#content").on("click", "#abortCmd", async function () {
    console.log("login");
    saveContentScrollPosition();
    renderLoginForm();
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering
function showWaitingGif() {
  eraseContent();
  $("#content").append(
    $(
      "<div class='waitingGifcontainer' > <img class='waitingGif' src='images/Loading_icon.gif' /></div > '"
    )
  );
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

function updateHeader(desc, name) {
  localStorage.setItem("currentPage", name);
  let header = $("#header");
  let loggedUser = API.retrieveLoggedUser();
  header.empty();
  header.append(
    $(`
            <span title="${desc}" id="${name + "cmd"}">
                <img src="images/PhotoCloudLogo.png" class="appLogo">
            </span>
            <span class="viewTitle">${desc}
                <div class="cmdIcon fa fa-plus" id="newPhotoCmd" title="Ajouter une photo"></div>
            </span>
            <div class="headerMenusContainer">
                <span>&nbsp;</span> 
                <!--filler-->
                <i title="Modifier votre profil">
                    <div class="UserAvatarSmall" id="editProfilCmd"
                        style="background-image:url('${
                          loggedUser === null ? "" : loggedUser.Avatar
                        }')"
                        title="${loggedUser === null ? "" : loggedUser.Name}">
                    </div>
                </i>
                <div data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="cmdIcon fa fa-ellipsis-vertical"></i>
                </div>
                <div class="dropdown-menu noselect"></div>
            </div>
        `)
  );

  let dropDownContent = showDropDown();
  $(".dropdown-menu.noselect").append(dropDownContent);
    if(loggedUser == null){

        $('#logoutCmd').hide();
        $('#manageUserCm').hide();
        $('#editProfileMenuCmd').hide();
        $('#listPhotosMenuCmd').hide();
        $('#sortByDateCmd').hide();
        $('#sortByOwnersCmd').hide();
        $('#sortByLikesCmd').hide();
        $('#ownerOnlyCmd').hide();
        $('#premier').hide();
        $('#deuxieme').hide();
        $('#troisieme').hide();
    }
  if(loggedUser != null && loggedUser.Authorizations.readAccess === 1){
      $('#manageUserCm').hide();
      $('#premier').hide();
  }
  if(loggedUser != null && (loggedUser.Authorizations.readAccess === 1 ||loggedUser.Authorizations.readAccess === 2)){
      $('#loginCmd').hide();
  }
  header.on("click", "#logoutCmd", async function () {
    console.log("logout");
    saveContentScrollPosition();
    await API.logout();
    window.location.href = window.location.origin + window.location.pathname;
    renderLoginForm();
  });
  header.on("click", "#editProfileMenuCmd", async function () {
    console.log("modification");
    saveContentScrollPosition();
    renderModificationProfile();
    initFormValidation();
    initImageUploaders();
    addConflictValidation(API.checkConflictURL(), 'Email', 'saveUser');
    $("#editProfileForm").submit(async function (e) {
      e.preventDefault();
      let profile = getFormData($("#editProfileForm"));
      profile.VerifyCode = profile.Email === profile.matchedEmail ? "verified" : "unverified";
      console.log(profile);
        API.modifyUserProfile(profile).then(newProfile => {
            console.log(newProfile)
            if (!newProfile) {
                renderLoginForm();
            } else {
                API.eraseLoggedUser(API.retrieveLoggedUser());
                API.storeLoggedUser(newProfile);
                renderCreateProfileVerification();
            }
        });
    });
    $("#content").on("click", "#abortCmd", async function () {
      saveContentScrollPosition();
      renderAbout();
    });
  });

  header.on("click", "#aboutCmd", async function () {
    console.log("about");
    saveContentScrollPosition();
    renderAbout();
  });
}
function showDropDown() {
  return `<span class="dropdown-item" id="manageUserCm"> 
            <i class="menuIcon fas fa-user-cog mx-2"></i> Gestion des usagers </span>
        <div class="dropdown-divider"  id="premier" ></div>
        <span class="dropdown-item" id="loginCmd"> <i class="menuIcon fa fa-sign-out mx-2"></i> Connexion </span>
        <span class="dropdown-item" id="logoutCmd"> <i class="menuIcon fa fa-sign-out mx-2"></i> Déconnexion </span>
        <span class="dropdown-item" id="editProfileMenuCmd"> <i class="menuIcon fa fa-user-edit mx-2"></i> Modifier votre profil </span>
        <div class="dropdown-divider" id="deuxieme" ></div>
        <span class="dropdown-item" id="listPhotosMenuCmd"> <i class="menuIcon fa fa-image mx-2"></i> Liste des photos </span>
        <div class="dropdown-divider"  id="troisieme" ></div>
        <span class="dropdown-item" id="sortByDateCmd"> <i class="menuIcon fa fa-check mx-2"></i> 
        <i class="menuIcon fa fa-calendar mx-2"></i> Photos par date de création </span> 
        <span class="dropdown-item" id="sortByOwnersCmd"> <i class="menuIcon fa fa-fw mx-2"></i> 
        <i class="menuIcon fa fa-users mx-2"></i> Photos par créateur </span> 
        <span class="dropdown-item" id="sortByLikesCmd"> 
        <i class="menuIcon fa fa-fw mx-2"></i> 
        <i class="menuIcon fa fa-user mx-2"></i> Photos les plus aiméés </span> 
        <span class="dropdown-item" id="ownerOnlyCmd"> <i
        class="menuIcon fa fa-fw mx-2"></i> <i class="menuIcon fa fa-user mx-2"></i> Mes photos </span>
        <div class="dropdown-divider"></div>
        <span class="dropdown-item" id="aboutCmd"> 
        <i class="menuIcon fa fa-info-circle mx-2"></i> À propos... </span></div>`;
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
                    Auteur: Léa Trudeau et Luis Carlos Lopez
                </p>
                <p>
                    Collège Lionel-Groulx, automne 2023
                </p>
            </div>
    `)
  );
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
        `)
  );
}

//added
//true if creating a new user
function saveUserInput(isToCreate = false) {
  Email = $("input[name='Email']").val();
  Password = $("input[name='Password']").val();
  if (isToCreate) {
    Name = $("#Name").val();
  }
}
//logout

//login
async function login() {
  const res = await API.login(Email, Password);
  if (!res) {
    if (API.currentStatus === 481) {
      loginMessage = "";
      EmailError = "Email introuvable";
      PasswordError = "";
    } else if (API.currentStatus === 482) {
      loginMessage = "";
      EmailError = "";
      PasswordError = "Mot de passe incorrecte";
    } else {
      loginMessage = "Le serveur ne répond pas";
      EmailError = "";
      PasswordError = "";
    }

    renderLoginForm(loginMessage, Email, EmailError, PasswordError);
  } else {
    if (API.retrieveLoggedUser().VerifyCode === "verified") {
      loginMessage = "Succes lors de la connexion";
      renderAbout();
    } else {
      loginMessage =
        "Veuillez entrer le code de vérification que vous avez reçu par courriel";
      renderCreateProfileVerification();
    }
  }
}

function renderLoginForm(
  loginMessage = "",
  Email = "",
  EmailError = "",
  passwordError = ""
) {
  console.log(":3");
  updateHeader("Connexion", "login");
  $("#newPhotoCmd").hide();
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
                    <input type='submit' name='submit' id="loginPls" value="Entrer" class="form-control btn-primary">
                </form>
                <div class="form">
                    <hr>
                    <button class="form-control btn-info" id="createProfileCmd">Nouveau compte</button>
                </div>  
            </div>
        `)
  );
}

//create
function renderCreateProfile() {
  //fonction du prof
  noTimeout(); // ne pas limiter le temps d’inactivité
  eraseContent(); // effacer le conteneur #content
  updateHeader("Inscription", "createProfil"); // mettre à jour l’entête et menu
  $("#newPhotoCmd").hide(); // camouffler l’icone de commande d’ajout de photo
  $("#content").append(
    $(`
            <form class="form" id="createProfileForm"> 
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
                         imageSrc='images/no-avatar.png'
                        waitingImage="images/Loading_icon.gif">
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
        `)
  );
  $("#loginCmd").on("click", renderLoginForm); // call back sur clic
  initFormValidation();
  initImageUploaders();
  $("#abortCmd").on("click", renderLoginForm); // call back sur clic
  // ajouter le mécanisme de vérification de doublon de courriel
  addConflictValidation(API.checkConflictURL(), "Email", "saveUser");
  // call back la soumission du formulaire
  $("#createProfileForm").on("submit", function (event) {
    let profile = getFormData($("#createProfileForm"));
    delete profile.matchedPassword;
    delete profile.matchedEmail;
    event.preventDefault();
    showWaitingGif();
    createProfile(profile); // commander la création au service API
  });
}

async function createProfile(profile) {
  if (await API.register(profile)) {
    loginMessage = "Votre compte a ete cree.";
    renderLoginForm();
  } else {
    renderError("Un probleme est survenu.");
  }
}

function getFormData($form) {
  const removeTag = new RegExp("(<[a-zA-Z0-9]+>)|(</[a-zA-Z0-9]+>)", "g");
  var jsonObject = {};
  $.each($form.serializeArray(), (index, control) => {
    jsonObject[control.name] = control.value.replace(removeTag, "");
  });
  return jsonObject;
}

function renderCreateProfileVerification() {
  saveContentScrollPosition();
  eraseContent();
  //verify code
  $("#content").append(
    $(`
            <div class="content" style="text-align:center">
                <h3>${loginMessage}</h3>
                <form class="form" id="VerificationForm">
                    <input
                        name='CodeVerification'
                        id='CodeVerification'
                        class="form-control"
                        required
                        pattern="[0-9]*"
                        RequireMessage = 'Veuillez entrer votre code de vérification'
                        placeholder="Code de vérification de courriel">
                    <span style='color:red'>${CodeError}</span>
                    <input type='submit' id="submitCode" name='submitCode' value="Vérifier" class="form-control btn-primary">
                </form>  
            </div>
        `)
  );
  $("#VerificationForm").submit(function (e) {
    console.log("check code");
    e.preventDefault();
    Code = $("input[name='CodeVerification']").val();
    try {
      profileVerification();
    } catch (e) {
      console.log(e);
    }
  });
}

async function profileVerification() {
  if (await API.verifyEmail(API.retrieveLoggedUser().Id, Code)) {
    renderAbout();
  } else {
    CodeError = "Le code ne correspond pas au code lie a votre compte";
  }
  renderCreateProfileVerification();
}

function renderModificationProfile() {
  updateHeader("Modification", "Modification");
  let loggedUser = API.retrieveLoggedUser();
  saveContentScrollPosition();
  eraseContent();
  initImageUploaders()

  $("#content").append(
    $(`
 <form class="form" id="editProfileForm"> <input type="hidden" name="Id" id="Id" value="${loggedUser.Id}"/>
        <fieldset>
            <legend>Adresse ce courriel</legend>
            <input type="email" class="form-control Email" name="Email" id="Email" placeholder="Courriel" required
                   RequireMessage='Veuillez entrer votre courriel' InvalidMessage='Courriel invalide'
                   CustomErrorMessage="Ce courriel est déjà utilisé" value="${loggedUser.Email}"> 
            <input
                class="form-control MatchedInput" type="text" matchedInputId="Email" name="matchedEmail"
                id="matchedEmail" placeholder="Vérification" required
                RequireMessage='Veuillez entrez de nouveau votre courriel'
                InvalidMessage="Les courriels ne correspondent pas" value="${loggedUser.Email}"></fieldset>
        <fieldset>
            <legend>Mot de passe</legend>
            <input type="password" class="form-control" name="Password" id="Password" placeholder="Mot de passe"
                   InvalidMessage='Mot de passe trop court'> <input class="form-control MatchedInput" type="password"
                                                                    matchedInputId="Password" name="matchedPassword"
                                                                    id="matchedPassword" placeholder="Vérification"
                                                                    InvalidMessage="Ne correspond pas au mot de passe">
        </fieldset>
        <fieldset>
            <legend>Nom</legend>
            <input type="text" class="form-control Alpha" name="Name" id="Name" placeholder="Nom" required
                   RequireMessage='Veuillez entrer votre nom' InvalidMessage='Nom invalide' value="${loggedUser.Name}">
        </fieldset>
        <fieldset>
            <legend>Avatar</legend>
                 <div class="imageUploader"
                         newImage='false'
                         controlId='Avatar'
                         imageSrc='${loggedUser.Avatar}'
                        waitingImage="images/Loading_icon.gif">
                    </div>
        </fieldset>
        <input type='submit' name='submit' id='saveUserCmd' value="Enregistrer"
               class="form-control btn-primary"> </form>
        <div class="cancel">
            <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
        </div>
        <div class="cancel">
            <hr>
            <a>
                <button class="form-control btn-warning" id="renderDeleteProfile">Effacer le compte</button>
            </a></div>

    </div>
    `)
  );
  $('#content').on("click","#renderDeleteProfile", function (){
    renderDeleteProfile();
  });
}
function renderDeleteProfile(){
  let loggedUser = API.retrieveLoggedUser();
  eraseContent()
  updateHeader("Retrait de compte", "Retrait de compte")
  timeout()
  $("#content").append(`
        <div class="viewTitle" style="text-align: center">Voulez-vous vraiment effacer votre compte?</div> 
        <form class="UserdeleteForm">
            <input  type='submit' name='submit' value="Effacer mon compte" class="form-control btn-danger UserdeleteForm">
        </form>
        <div class="UserdeleteForm">
            <button class="form-control btn-secondary" id="cancelCmd">Annuler</button>
        </div>
    `)
  $(`.UserdeleteForm`).submit(async (e) => {
    e.preventDefault()
    const res = await API.unsubscribeAccount(loggedUser.Id);
    if(res){
      API.logout();
      renderLoginForm();
      console.log("delete");
    }
  })
  $(`#cancelCmd`).click(() => {
    renderModificationProfile();
  });

}
