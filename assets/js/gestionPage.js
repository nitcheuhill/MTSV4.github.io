
const modal = document.getElementById('myModal');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const successModal = document.getElementById('successModal');
const closeSuccessModalBtn = document.getElementById('closeSuccessModal');

// Ouverture de la modale de connexion
openModalBtn.addEventListener('click', function () {
  modal.style.display = 'block';
  document.body.classList.add('modal-open'); // Désactiver le défilement
});

// Fermeture de la modale de connexion
closeModalBtn.addEventListener('click', function () {
  modal.style.display = 'none';
  document.body.classList.remove('modal-open'); // Réactiver le défilement  
});

// Fermer la modale de connexion en cliquant à l'extérieur du contenu
window.addEventListener('click', function (e) {
  if (e.target == modal) {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
});



// 
// 
//  

  



// // Gestion de la soumission du formulaire de connexion
// const loginForm = document.getElementById('loginForm');
// loginForm.addEventListener('submit', function (e) {
//   e.preventDefault(); // Empêche la soumission du formulaire

//   const email = document.getElementById('email').value;
//   const password = document.getElementById('password').value;

//   // Vérification des identifiants
//   if (email === 'nitcheu@gmail.com' && password === '1234') {
//     modal.style.display = 'none'; // Ferme la modale de connexion
//     successModal.style.display = 'block'; // Ouvre la modale de succès
//   } else {
//     alert('Identifiants invalides.'); // Affiche un message d'erreur
//   }
// });

// // Fermeture de la modale de succès
// closeSuccessModalBtn.addEventListener('click', function () {
//   successModal.style.display = 'none';
//   document.body.classList.remove('modal-open'); // Réactiver le défilement
// });

// // Fermer la modale de succès en cliquant à l'extérieur du contenu
// window.addEventListener('click', function (e) {
//   if (e.target == successModal) {
//     successModal.style.display = 'none';
//     document.body.classList.remove('modal-open');
//   }
// });
