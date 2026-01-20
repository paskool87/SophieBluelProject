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



export function clearGallery() {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
}









