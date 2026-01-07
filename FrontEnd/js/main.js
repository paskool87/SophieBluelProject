import { afficherWorks, fetchWorks, getWorks, clearWorks, fetchCategories, getcategories, clearCategories } from'./fonctions.js';
const works = await getWorks();
const categories =  await getcategories();

works.forEach(work => {
    afficherWorks(work.title, work.imageUrl);
});

const filtres = document.querySelector('.filters');
const allButton = document.createElement('button');
allButton.textContent = 'Tous';
allButton.classList.add('filterBtn', 'active');

filtres.appendChild(allButton);

categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category.name;
    button.classList.add('filterBtn');
    button.dataset.categoryId = category.id;
    filtres.appendChild(button);
});