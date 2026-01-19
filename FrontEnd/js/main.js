import {
  afficherWorks,
  fetchWorks,
  getWorks,
  clearWorks,
  fetchCategories,
  getcategories,
  clearCategories,
  clearGallery,
  filtrerWorksByCategory,
  modeEdit,
  modeEditExit,
  afficherWorksInModal,
  afficherModalGallery,
  afficherModalAjoutPhoto,
} from "./fonctions.js";
let works = await getWorks();
const categories = await getcategories();
clearGallery();

works.forEach((work) => {
  afficherWorks(work.title, work.imageUrl, work.id);
});

const filtres = document.querySelector(".filters");
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
    `button[data-category-id='${category.id}']`,
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
  const modal = document.querySelector(".modal-background");
  modal.classList.remove("hidden");
  afficherModalGallery(works);
});

const closeModalButton = document.querySelector(".closeModal");
closeModalButton.addEventListener("click", () => {
  const hidden = document.querySelector(".modal-background");
  hidden.classList.add("hidden");
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
});
