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
  
} from "./fonctions.js";
const works = await getWorks();
const categories = await getcategories();

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
tousBtn.addEventListener("click", async () => {
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
  button.addEventListener("click", async () => {
    clearGallery();
    filteredWorks.forEach((work) => {
      afficherWorks(work.title, work.imageUrl);
    });
  });
});

