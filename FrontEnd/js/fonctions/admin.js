export async function connexionAdmin() {
  const form = document.getElementById("loginForm");
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  const message = document.querySelector(".errorMessage");

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      

      // Afficher le message d'erreur dans la page de connexion
      message.style.display = "block";
      message.innerText = "Erreur dans l’identifiant ou le mot de passe";
      setTimeout(() => {
        message.innerHTML = "";
        message.style.display = "none";
      }, 3000);
      return;
      //throw new Error("Erreur lors de la connexion");
    }

    // Connexion réussie
    const result = await response.json();

    localStorage.setItem("token", result.token);
    localStorage.setItem("editMode", "true");

    window.location.href = "index.html";
    return result;
  } catch (error) {
    message.innerText = "Erreur lors de la connexion aux données";
    message.style.display = "block";

    console.error("Erreur lors de la connexion :", error);

    throw error;
  }
}

//Entrer en mode édition
export function modeEdit() {
  const headerEdit = document.querySelector("body");
  const editBar = document.createElement("div");
  editBar.classList.add("editBar");
  editBar.innerHTML = `
  <i class="fas fa-edit">
  </i>Mode édition`;
  headerEdit.prepend(editBar);

  const log = document.querySelector(".log");
  log.textContent = "logout";
  log.removeAttribute("href");
  log.classList.add("out");

  const filtres = document.querySelector(".filters");
  const modif = document.querySelector(".modifier");
  filtres.style.display = "none";
  modif.style.display = "flex";
}

//Quitter le mode édition
export function modeEditExit() {
  const filtres = document.querySelector(".filters");
  const modif = document.querySelector(".modifier");
  filtres.style.display = "flex";
  modif.style.display = "none";
  const editMode = localStorage.getItem("editMode");
  if (editMode === "true") {
    localStorage.removeItem("editMode");
    localStorage.removeItem("token");
  }

  location.reload();
}
