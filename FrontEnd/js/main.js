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
  afficherModalGallery

  
} from "./fonctions.js";
const works = await getWorks();
const categories = await getcategories();
console.log(works);
clearGallery();

works.forEach((work) => {
  afficherWorks(work.title, work.imageUrl);
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
tousBtn.addEventListener("click",  () => {
  clearGallery();

  works.forEach((work) => {
    afficherWorks(work.title, work.imageUrl);
  });
});

categories.forEach((category) => {
  const button = document.querySelector(
    `button[data-category-id='${category.id}']`
  );
  const filteredWorks = filtrerWorksByCategory(works, category.id);
  button.addEventListener("click",  () => {
    clearGallery();
    filteredWorks.forEach((work) => {
      afficherWorks(work.title, work.imageUrl);
    });
  });
});

const editMode = localStorage.getItem("editMode");
if (editMode === "true") {
    modeEdit();
}

afficherModalGallery(works);

  const logoutLink = document.querySelector(".log.out");
  
  logoutLink.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("editMode");
    
    modeEditExit();});
    
