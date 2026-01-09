import{
    connexionAdmin
}
from "./fonctions.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  localStorage.removeItem('token');

  connexionAdmin();

});