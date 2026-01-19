export function afficherWorks(title, srcImage, id) {
  const gallery = document.querySelector(".gallery");
  const figure = document.createElement("figure");
  figure.dataset.id = id;
  const image = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  image.src = srcImage;
  image.alt = title;
  figcaption.textContent = title;
  figure.appendChild(image);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

export async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
  } catch (error) {
    console.error("Erreur lors de la récupération des works :", error);
    return [];
  }
}

export async function getWorks() {
  const stored = localStorage.getItem("works");
  if (stored) {
    return JSON.parse(stored);
  } else {
    const works = await fetchWorks();
    localStorage.setItem("works", JSON.stringify(works));
    return works;
  }
}
export function clearWorks() {
  localStorage.removeItem("works");
}

export async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error("Erreur lors de la récupération des categories :", error);
    return [];
  }
}

export async function getcategories() {
  const stored = localStorage.getItem("categories");
  if (stored) {
    return JSON.parse(stored);
  } else {
    const categories = await fetchCategories();
    localStorage.setItem("categories", JSON.stringify(categories));
    return categories;
  }
}

export function clearCategories() {
  localStorage.removeItem("categories");
}

export function clearGallery() {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
}

export function filtrerWorksByCategory(works, categoryId) {
  return works.filter((work) => work.categoryId === categoryId);
}

export async function connexionAdmin() {
  const form = document.getElementById("loginForm");
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.log("Erreur de connexion");
      const message = document.querySelector(".errorMessage");
      message.style.display = "block";
      message.innerText = "Erreur dans l’identifiant ou le mot de passe";
      setTimeout(() => {
        message.innerHTML = "";
        message.style.display = "none";
      }, 3000);
      throw new Error("Erreur lors de la connexion");
    }
    const result = await response.json();

    localStorage.setItem("token", result.token);
    localStorage.setItem("editMode", "true");

    window.location.href = "index.html";
    return result;
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw error;
  }
}

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

export function afficherWorksInModal(srcImage, id) {
  const gallery = document.querySelector(".modalGallery");
  const figure = document.createElement("figure");
  figure.dataset.id = id;

  const image = document.createElement("img");

  figure.style.position = "relative";

  const trash = document.createElement("div");
  trash.classList.add("poubelle");
  trash.dataset.id = id;
  figure.appendChild(trash);

  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fas", "fa-trash-alt", "deleteIcon");
  trash.appendChild(deleteIcon);

  image.src = srcImage;
  figure.appendChild(image);
  gallery.appendChild(figure);
}

export function afficherModalGallery(works) {
  const gallery = document.querySelector(".modal-content");
  gallery.innerHTML = `
				<h3>Galerie photo</h3>
				<div class="modalGallery">
				</div>
				<button class="modalAjoutBtn">Ajouter une photo</button>`;

  works.forEach((work) => {
    afficherWorksInModal(work.imageUrl, work.id);
  });

  const modalAjoutBtn = document.querySelector(".modalAjoutBtn");
  modalAjoutBtn.addEventListener("click", () => {
    afficherModalAjoutPhoto();
  });

  // Gestion de la suppression d'une photo

  const modalGallery = document.querySelector(".modalGallery");
  modalGallery.addEventListener("click", async (e) => {
    const clickSurPoubelle = e.target.closest(".poubelle");
    if (!clickSurPoubelle) return;

    const ok = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
    if (!ok) return;

    const id_Asupprimer = Number(clickSurPoubelle.dataset.id);
    await supprimerProjet(id_Asupprimer);

    const figureModal = modalGallery.querySelector(
      `figure[data-id="${id_Asupprimer}"]`,
    );
    if (figureModal) figureModal.remove();

    const mainGallery = document.querySelector(".gallery");
    const figureMain = mainGallery.querySelector(
      `figure[data-id="${id_Asupprimer}"]`,
    );
    if (figureMain) figureMain.remove();

    let projets = JSON.parse(localStorage.getItem("works")) || [];
    projets = projets.filter((p) => p.id !== id_Asupprimer);
    localStorage.setItem("works", JSON.stringify(projets));
  });
}

async function supprimerProjet(id) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
      alert("Session expirée. Merci de vous reconnecter.");
      modeEditExit();
      return false;
    }
    if (!response.ok) {
      console.error("Erreur lors de la suppression du projet");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Erreur réseau :", error);
    return false;
  }
}

export function afficherModalAjoutPhoto() {
  const gallery = document.querySelector(".modal-content");
  gallery.innerHTML = `
			<i class="fas fa-arrow-left modalFleche"></i>
			<h3>Ajout photo</h3>

				<div class="ModalboxPhoto">
          <img id="preview" class="preview hidden" alt="">
					<i class="fas fa-image ModalPicture " ></i>
          <label for="photo" class="ModalAjoutPhotoBtn Label ">+ Ajouter photo</label>
          <input class = "ModalAjoutPhotoInput"
            type="file"
            id="photo" 
            accept="image/jpeg, image/png"
            hidden
            required
          />					
          <p class = "maxImage">jpg, png : 4mo max</p>

				</div>
	      <form class="addPhotoForm">
  		    <div class="form-group">
    		    <label class ="titreLabel" for="titre">Titre</label>
    		    <input type="text" id="titre" name="titre" required>
  		    </div>
        <div class="ModalboxPage">

  	      <div class="form-group liste" >
    	      <label for="categorie">Catégorie</label>
    	      <select id="categorie" name="categorie" required>
      		    <option value=""></option>
    	      </select>
          </div>
      </div>

          <button class="modalFormBtn" type="submit">Valider</button>
        </form>
`;

  const categories = JSON.parse(localStorage.getItem("categories"));
  const categorieSelect = document.getElementById("categorie");
  const titreInput = document.getElementById("titre");
  let photoPresente = false;
  const submitBtn = document.querySelector(".modalFormBtn");
  submitBtn.disabled = true;

  categories.forEach((category) => {
    const optionElem = document.createElement("option");
    optionElem.value = category.id;
    optionElem.textContent = category.name;
    categorieSelect.appendChild(optionElem);
  });

  const inputImage = document.getElementById("photo");
  const previewImage = document.getElementById("preview");
  const picture = document.querySelector(".ModalPicture");
  const labelBtn = document.querySelector(".ModalAjoutPhotoBtn");
  const maxImage = document.querySelector(".maxImage");

  inputImage.addEventListener("change", (event) => {
    inputImage.classList.add("hidden");
    previewImage.classList.remove("hidden");
    picture.classList.add("hidden");
    labelBtn.classList.add("hidden");
    maxImage.classList.add("hidden");

    const file = inputImage.files[0];

    if (!file) return;
    const maxSize = 4 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Format invalide. JPEG ou PNG uniquement.");
      input.value = "";
      return;
    }

    if (file.size > maxSize) {
      alert("Image trop lourde (4 Mo max).");
      input.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      previewImage.src = reader.result;
      preview.style.display = "block";
    };

    reader.readAsDataURL(file);
    photoPresente = true;
    validerForm();
  });

  titreInput.addEventListener("input", () => {
    validerForm();
  });

  categorieSelect.addEventListener("change", () => {
    validerForm();
  });

  function validerForm() {
    if (
      photoPresente &&
      titreInput.value.trim() !== "" &&
      categorieSelect.value !== ""
    ) {
      submitBtn.disabled = false;
      submitBtn.classList.add("valide");
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.remove("valide");
    }
  }

  const form = document.querySelector(".addPhotoForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    envoyerFormulaire();

    const hidden = document.querySelector(".modal-background");
    hidden.classList.add("hidden");
  });

  async function envoyerFormulaire() {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("image", inputImage.files[0]);
    formData.append("title", titreInput.value);
    formData.append("category", categorieSelect.value);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");

        alert("Session expirée. Merci de vous reconnecter.");
        modeEditExit();
      }

      if (!response.ok) {
        console.error("Erreur serveur");
        return;
      }

      const data = await response.json();

      data.categoryId = Number(data.categoryId);
      console.log("Projet créé :", data);

      let projets = JSON.parse(localStorage.getItem("works")) || [];

      console.log("Projets avant ajout :", projets);
      console.log("Nouveau projet :", data);

      projets.push(data);
      localStorage.setItem("works", JSON.stringify(projets));

      afficherWorks(data.title, data.imageUrl, data.id);
      afficherModalGallery(projets);
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  }

  const works = JSON.parse(localStorage.getItem("works"));
  const modalFleche = document.querySelector(".modalFleche");
  modalFleche.addEventListener("click", () => {
    afficherModalGallery(works);
  });
}
