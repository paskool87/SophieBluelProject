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

const form = document.querySelector("#loginForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const errorMessage = document.querySelector(".errorMessage");

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log(response.status);

    if (response.status === 200) {

      localStorage.setItem("token", data.token);
      window.location.href = "./index.html";

    } else if (response.status === 401 || response.status === 404 || response.status === 405) {

      errorMessage.textContent = "Email ou mot de passe incorrect";
      errorMessage.style.display = "block";

    } else {
      errorMessage.textContent = "Une erreur est survenue. Réessayez.";
      errorMessage.style.display = "block";
    }

  } catch (error) {
    console.error("Erreur réseau :", error);
    errorMessage.textContent = "Impossible de contacter le serveur.";
    errorMessage.style.display = "block";
  }
});
