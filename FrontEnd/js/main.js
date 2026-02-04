import { afficherWorks, getWorks, clearGallery } from "./fonctions/projets.js";

import { getcategories, filtrerWorksByCategory } from "./fonctions/category.js";

import { modeEdit, modeEditExit } from "./fonctions/admin.js";

import { afficherModalGallery } from "./fonctions/modalGallery.js";

// on récupère les variables dans localStorage

let works = await getWorks();
const categories = await getcategories();
clearGallery();

// affichage des projets

works.forEach((work) => {
  afficherWorks(work.title, work.imageUrl, work.id);
});

// affichage du bouton tous

const filtres = document.querySelector(".filters");
const allButton = document.createElement("button");
allButton.textContent = "Tous";
allButton.classList.add("filterBtn", "tous", "active");

filtres.appendChild(allButton);

// affichage des boutons filtre

categories.forEach((category) => {
  const button = document.createElement("button");
  button.textContent = category.name;
  button.classList.add("filterBtn");
  button.dataset.categoryId = category.id;
  filtres.appendChild(button);
});

// listener sur bouton tous

const tousBtn = document.querySelector(".tous");
tousBtn.addEventListener("click", () => {
  clearGallery();

  filtres.querySelectorAll(".filterBtn").forEach((btn) => {
    btn.classList.remove("active");
  });
  tousBtn.classList.add("active");

  works.forEach((work) => {
    afficherWorks(work.title, work.imageUrl, work.id);
  });
});

// listener sur boutons filtre

categories.forEach((category) => {
  const button = document.querySelector(
    `button[data-category-id='${category.id}']`,
  );

  const filteredWorks = filtrerWorksByCategory(works, category.id);
  button.addEventListener("click", () => {
    clearGallery();

    filtres.querySelectorAll(".filterBtn").forEach((btn) => {
      btn.classList.remove("active");
    });
    button.classList.add("active");
    filteredWorks.forEach((work) => {
      afficherWorks(work.title, work.imageUrl, work.id);
    });
  });
});

// eventuel mode edit

const editMode = localStorage.getItem("editMode");
if (editMode === "true") {
  modeEdit();
}

// listener sur modifier

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

  void modal.offsetHeight;

  setTimeout(() => {
    modal.style.transition = "opacity 0.6s ease, transform 0.8s ease";
    modal.style.opacity = "1";
    modal.style.transform = "translateY(0)";
  }, 100);

  afficherModalGallery(works);
});

// fermeture modal par la croix

const closeModalButton = document.querySelector(".closeModal");
closeModalButton.addEventListener("click", () => {
  const hidden = document.querySelector(".modal-background");
  const modal = document.querySelector(".modal");

  modal.style.transition = "none";
  modal.style.opacity = "1";
  modal.style.transform = "scale(1)";
  hidden.style.transition = "none";

  void modal.offsetHeight;

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

// fermeture de la modal par l 'arrière plan

const closeModalBack = document.querySelector(".modalBack");
closeModalBack.addEventListener("click", () => {
  const hidden = document.querySelector(".modal-background");
  hidden.classList.add("hidden");
});

// sortir du mode edit

const logoutLink = document.querySelector(".log.out");
logoutLink.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("editMode");

  modeEditExit();
});
