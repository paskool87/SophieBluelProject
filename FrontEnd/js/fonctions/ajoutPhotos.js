import {
  modeEditExit

} from "./admin.js";

import{
  afficherWorks,

} from "./projets.js"

import{
  afficherModalGallery,
  afficherWorksInModal

} from "./modalGallery.js"




export function afficherModalAjoutPhoto() {

  // Contenu HTML du modal d'ajout de photo
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
        <div class="toutRemplir">Ajoutez une photo, un titre et une catégorie</div>
        <div class="succesMessage"></div>
        <button class="modalFormBtn" type="submit">Valider</button>
      </form>
`;
// Récupération des catégories depuis le localStorage et remplissage du select
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

  //La photo de prévisualisation prend la place
  inputImage.addEventListener("change", (event) => {
    inputImage.classList.add("hidden");
    previewImage.classList.remove("hidden");
    picture.classList.add("hidden");
    labelBtn.classList.add("hidden");
    maxImage.classList.add("hidden");

    const file = inputImage.files[0];

    //test de conformité de l'image
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

//Image de preview
    const reader = new FileReader();

    reader.onload = function (e) {
      previewImage.src = reader.result;
      preview.style.display = "block";
    };

    reader.readAsDataURL(file);
    photoPresente = true;
    validerForm();
  });
//Ecoute si les champs sont remplis
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
      document.querySelector(".toutRemplir").classList.add("hidden");
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.remove("valide");
    }
  }

  const form = document.querySelector(".addPhotoForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    envoyerFormulaire();

// Message de réussite avant de fermer la modal
    const messageSucces = document.querySelector(".succesMessage");
    messageSucces.style.display = "block";
    messageSucces.innerText = "Nouveau projet ajouté avec succès !";
    setTimeout(() => {
      messageSucces.innerHTML = "";
      messageSucces.style.display = "none";
      const hidden = document.querySelector(".modal-background");
      hidden.classList.add("hidden");
    }, 3000);
  });

  async function envoyerFormulaire() {
    const token = localStorage.getItem("token");

// Nouveau projet vers l'API
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

// Nouveau projet dans le local storage
      let projets = JSON.parse(localStorage.getItem("works")) || [];

      projets.push(data);
      localStorage.setItem("works", JSON.stringify(projets));

// il s'affiche directement dans les galeries
      afficherWorks(data.title, data.imageUrl, data.id);
      afficherWorksInModal(data.imageUrl, data.id);

    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  }
// Revenir en arrière
  const works = JSON.parse(localStorage.getItem("works"));
  const modalFleche = document.querySelector(".modalFleche");
  modalFleche.addEventListener("click", () => {
    afficherModalGallery(works);
  });
}
