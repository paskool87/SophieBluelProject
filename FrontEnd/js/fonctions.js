export function afficherWorks(title, srcImage) {
  const gallery = document.querySelector(".gallery");
  const figure = document.createElement("figure");
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

  location.reload();
}
