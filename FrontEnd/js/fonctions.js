export function afficherWorks(title,srcImage) {
    const gallery = document.querySelector('.gallery');
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    const figcaption = document.createElement('figcaption');
    image.src = srcImage;
    image.alt = title;
    figcaption.textContent = title;
    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);

}

export async function fetchWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();
        return works;
    } catch (error) {
        console.error('Erreur lors de la récupération des works :', error);
        return [];
    } 
}  

export async function getWorks() {
    const stored = localStorage.getItem('works');
    if (stored) {
        return JSON.parse(stored);
    } else {
        const works = await fetchWorks();
        localStorage.setItem('works', JSON.stringify(works));
        return works;
    }
}
export function clearWorks() {
    localStorage.removeItem('works');
}

export async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error('Erreur lors de la récupération des categories :', error);
        return [];
    } 
}  


export async function getcategories() {
    const stored = localStorage.getItem('categories');
    if (stored) {
        return JSON.parse(stored);
    } else {
        const categories = await fetchCategories();
        localStorage.setItem('categories', JSON.stringify(categories));
        return categories;
    }
}

export function clearCategories() {
    localStorage.removeItem('categories');
}