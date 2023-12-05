//import User from "../../../models/user.js"; ca fait crash le site

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
  $("#loginForm").submit(function (e) {
    console.log("trying to login");
    e.preventDefault();
    saveUserInput();
    //try to login
    API.login(Email, Password).then((res) => {
      //error code in responses
      //481 == user not found
      //482 == wrong password
      if (!res) {
        if (API.currentStatus === 481 || API.currentStatus === 482) {
          if (API.currentStatus === 481) {
            loginMessage = "";
            EmailError = "Email introuvable";
            PasswordError = "";
          } else if (API.currentStatus === 482) {
            loginMessage = "";
            EmailError = "";
            PasswordError = "Mot de passe incorrecte";
          }
          renderLoginForm(loginMessage, Email, EmailError, PasswordError);
        }
        // else {
        //     loginMessage = "Le serveur ne répond pas";
        //     renderError(loginMessage);
        // }
      } else {
        if (res.VerifyCode === "verified") {
          //render user login
          loginMessage = "Succes lors de la connexion";
          renderLoginForm(loginMessage, Email, EmailError, PasswordError);
        } else {
          loginMessage =
            "Veuillez entrer le code de vérification que vous avez reçu par courriel";
          renderCreateProfileVerification();
        }
      }
    });
  });
  //   $("#createProfileForm").submit(function (e) {
  //     console.log("trying to create account");
  //     e.preventDefault();
  //     saveUserInput(true);
  //     let name = $("input[name='Email']").val();
  //     let user = User(name, Email, Password, 0, Authorizations.user());
  //     API.register(user);
  //     console.log("sent email to user " + user.Id);
  //   });
  //go to creation page
  $("#content").on("click", "#createProfileCmd", async function () {
    console.log("creation profile");
    saveContentScrollPosition();
    renderCreateProfile();
    initFormValidation();
    // addConflictValidation("Users", "Name", "createProfileCmd");
    // addConflictValidation("Users", "Email", "createProfileCmd");
  });
  //create profile
  $("#saveUserCmd").submit(function (e) {
    console.log("saving profile");
    e.preventDefault();
    saveUserInput(true);
    let newUser = new User();
    newUser.Name = Name;
    newUser.Email = Email;
    newUser.Password = Password;
    console.log("saving user " + newUser.Id);
    // API.register(newUser);
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
function updateHeader(headerTitleFR, headerTitleEN) {
  //TODO : faire en sorte que le titre change selon la langue
  let header = $("#header");
  let headerTitle = headerTitleFR;
  header.empty();
  header.append(
    $(`
            <div id="header"> 
                <span title="${headerTitle}" id="listPhotosCmd"> 
                    <img src="images/PhotoCloudLogo.png" class="appLogo"> 
                </span> 
                <span class="viewTitle">${headerTitle}
                    <div class="cmdIcon fa fa-plus" id="newPhotoCmd" title="Ajouter une photo"></div> 
                </span>
                <div class="headerMenusContainer">
                    <span>&nbsp;</span>
                    <!--filler-->
                    <i title="Modifier votre profil">
                        <div class="UserAvatarSmall"</div>
                    </i> 
                    <div class="dropdown ms-auto dropdownLayout"> 
                    <!-- Articles de menu --> 
                    </div> </div>
            </div>
        `)
  );
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
  console.log("Email: " + Email, "Password: " + Password);
  if (isToCreate) {
    Name = $("#Name").val();
    console.log("Name: " + Name);
  }
}
//login
function renderLoginForm(
  loginMessage = "",
  Email = "",
  EmailError = "",
  passwordError = ""
) {
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
                    <input type='submit' name='submit' value="Entrer" class="form-control btn-primary">
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
  $("#createProfilForm").on("submit", function (event) {
    let profile = getFormData($("#createProfileForm"));
    delete profile.matchedPassword;
    delete profile.matchedEmail;
    event.preventDefault();
    showWaitingGif(); //
    createProfileForm(profil); // commander la création au service API
  });
}
function createProfileForm() {
  console.log("Create profile with API");
}
function renderCreateProfileVerification() {
  saveContentScrollPosition();
  eraseContent();
  $("#content").append(
    $(`
            <div class="content" style="text-align:center">
                <h3>${loginMessage}</h3>
                <form class="form" id="VerificationForm">
                    <input type='number'
                        name='CodeVerification'
                        class="form-control"
                        required
                        RequireMessage = 'Veuillez entrer votre code de vérification'
                        placeholder="Code de vérification de courriel">
                    <span style='color:red'>${CodeError}</span>
                    <input type='submit' name='submitCode' value="Vérifier" class="form-control btn-primary">
                </form>  
            </div>
        `)
  );
}

async function createProfile(profile) {
  if (await API.register(profile)) {
    loginMessage = "Votre compte a ete cree.";
    renderLoginForm();
  } else {
    renderError("Un probleme est survenu.");
  }
}
