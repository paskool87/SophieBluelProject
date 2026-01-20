import{
  afficherModalAjoutPhoto,
  
} from "./js/fonctions/ajoutPhotos.js";

import{
  modeEditExit,
  
} from "./js/fonctions/admin.js";

//Affiche une image dans la modale avec l'icone poubelle
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


// affiche toutes les photos dans la modal
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

// Bouton vers le formulaire d'ajout
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

    const success = await supprimerProjet(id_Asupprimer);
    if (!success) return;

    // On efface directement des galeries et du localStorage
    const figureModal = modalGallery.querySelector(
      `figure[data-id="${id_Asupprimer}"]`
    );
    if (figureModal) figureModal.remove();

    const mainGallery = document.querySelector(".gallery");
    const figureMain = mainGallery.querySelector(
      `figure[data-id="${id_Asupprimer}"]`
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











