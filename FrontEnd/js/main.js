import {
  afficherWorks,
  getWorks,
  clearGallery,
} from "./js/fonctions/projets.js";

import {
  getcategories,
  filtrerWorksByCategory
} from "./js/fonctions/category.js";

import {
  modeEdit,
  modeEditExit
} from "./js/fonctions/admin.js";

import {
  afficherModalGallery
} from "./js/fonctions/modalGallery.js";




let works = await getWorks();
const categories = await getcategories();
clearGallery();

works.forEach((work) => {
  afficherWorks(work.title, work.imageUrl, work.id);
});

/*const filtres = document.querySelector(".filters");
const allButton = document.createElement("button");
allButton.textContent = "Tous";
allButton.classList.add("filterBtn", "tous", "active");

filtres.appendChild(allButton);

categories.forEach((category) => {
  const button = document.createElement("button");
  button.textContent = category.name;
  button.classList.add("filterBtn");
  button.dataset.categoryId = category.id;
  filtres.appendChild(button);
});

const tousBtn = document.querySelector(".tous");
tousBtn.addEventListener("click", () => {
  clearGallery();

  works.forEach((work) => {
    afficherWorks(work.title, work.imageUrl, work.id);
  });
});

categories.forEach((category) => {
  const button = document.querySelector(
    `button[data-category-id='${category.id}']`
  );

  const filteredWorks = filtrerWorksByCategory(works, category.id);
  button.addEventListener("click", () => {
    clearGallery();

    filteredWorks.forEach((work) => {
      afficherWorks(work.title, work.imageUrl, work.id);
    });
  });
});

const editMode = localStorage.getItem("editMode");
if (editMode === "true") {
  modeEdit();
}

//afficherModalGallery(works);
//afficherModalAjoutPhoto();
//modeEdit();
//localStorage.removeItem("works");

const modifBtn = document.querySelector(".modifier");
modifBtn.addEventListener("click", () => {
  works = JSON.parse(localStorage.getItem("works")) || works;
  const modalBackground = document.querySelector(".modal-background");
  const modal = modalBackground.querySelector(".modal");

  modalBackground.classList.remove("hidden");

  requestAnimationFrame(() => {
    modalBackground.classList.add("show"); 
  });

  modal.style.transition = "none";
  modal.style.opacity = "0";
  modal.style.transform = "translateY(-50px)";

  void modal.offsetHeight; // <-- lit la hauteur → forçage du reflow

  setTimeout(() => {
    modal.style.transition = "opacity 0.6s ease, transform 0.8s ease";
    modal.style.opacity = "1";
    modal.style.transform = "translateY(0)";
  }, 100);

  afficherModalGallery(works);
});

const closeModalButton = document.querySelector(".closeModal");
closeModalButton.addEventListener("click", () => {
  const hidden = document.querySelector(".modal-background");
  const modal = document.querySelector(".modal");

  modal.style.transition = "none";
  modal.style.opacity = "1";
  modal.style.transform = "scale(1)";
  hidden.style.transition = "none";

  void modal.offsetHeight; // <-- lit la hauteur → forçage du reflow

  setTimeout(() => {
    modal.style.transition = "opacity 0.6s ease, transform 0.4s ease";
    modal.style.opacity = "0";
    modal.style.transform = "scale(0.5)";
  }, 200);

  setTimeout(() => {
    hidden.style.transition = "opacity 0.5s ease, ";
    hidden.style.opacity = "1";
  }, 200);

  setTimeout(() => {
    hidden.classList.add("hidden");
  }, 500);
});

const closeModalBack = document.querySelector(".modalBack");
closeModalBack.addEventListener("click", () => {
  const hidden = document.querySelector(".modal-background");
  hidden.classList.add("hidden");
});

const logoutLink = document.querySelector(".log.out");
logoutLink.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("editMode");

  modeEditExit();
});*/
