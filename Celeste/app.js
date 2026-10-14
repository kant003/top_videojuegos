// Funcionalidad básica de interacción
let count = 0;
const likeBtn = document.getElementById('likeBtn');
const likesSpan = document.getElementById('likes');

likeBtn.addEventListener('click', () => {
    count++;
    likesSpan.textContent = count;
});