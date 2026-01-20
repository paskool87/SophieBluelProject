
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


export function filtrerWorksByCategory(works, categoryId) {
  return works.filter((work) => work.categoryId === categoryId);
}







