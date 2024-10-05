
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, query, where  } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDuYGSb0vUmEo65Cxa8arb4r1bqCJNSrjM",
  authDomain: "mtssarl-28760.firebaseapp.com",
  projectId: "mtssarl-28760",
  storageBucket: "mtssarl-28760.appspot.com",
  messagingSenderId: "998114514636",
  appId: "1:998114514636:web:8c293f113eba41461f1469",
  measurementId: "G-WN8P24DMEJ"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);



function showToast(message, isError = false) {
  Toastify({
    text: message,
    duration: 2000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    backgroundColor: isError ? "#ff6b6b" : "#51cf66",
  }).showToast();
}



// Gérer la soumission du formulaire
document.getElementById('imageFormimprimerie').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    // Récupérer les éléments du formulaire
    const imageFile = document.getElementById('imageUpload').files[0];
    const imageName = document.getElementById('imageName').value;
    const imageDescription = document.getElementById('imageDescription').value;
  
    // Spinner d'attente
    const spinner = document.getElementById('spinner2');
    spinner.style.display = 'inline-block';
  
    // Vérifier si une image a été sélectionnée
    if (!imageFile) {
      showToast("Veuillez sélectionner une image.", true);
      spinner.style.display = 'none';
      return;
    }
  
    try {
      // Référence de stockage pour l'image
      const storageRef = ref(storage, 'images/' + imageFile.name);
  
      // Uploader l'image dans Firebase Storage
      const snapshot = await uploadBytes(storageRef, imageFile);
  
      // Obtenir l'URL de téléchargement de l'image
      const imageUrl = await getDownloadURL(snapshot.ref);
  
      // Enregistrer les informations dans Firestore
      await addDoc(collection(db, "imprimerie"), {
        imageUrl,
        imageName,
        imageDescription
      });
  
      // Réinitialiser le formulaire
      document.getElementById('imageFormimprimerie').reset();
      showToast("Image téléchargée avec succès !");
  
      // Réafficher les données dans le tableau
      fetchAndDisplayData();
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image : ", error);
      showToast("Erreur lors du téléchargement de l'image.", true);
    }
  
    // Cacher le spinner
    spinner.style.display = 'none';
  });
  
  // Fonction pour récupérer et afficher les données dans le tableau
  async function fetchAndDisplayData() {
    const tableBody = document.querySelector("#productTable2 tbody");
    tableBody.innerHTML = ""; // Vider le tableau
  
    try {
      const querySnapshot = await getDocs(collection(db, "imprimerie"));
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const fileName = data.imageUrl.split('/').pop(); // Extraire le nom du fichier de l'URL
        const row = `
          <tr>
            <td>${fileName}</td> <!-- Afficher uniquement le nom du fichier -->
            <td>${data.imageName}</td>
            <td>${data.imageDescription}</td>
            <td>
              <button class="view-btn" data-url="${data.imageUrl}">Voir</button>
              <button class="delete-btn" data-id="${doc.id}">Supprimer</button>
            </td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
  
      // Ajouter un écouteur pour le bouton "Voir"
      document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function () {
          const imageUrl = this.getAttribute('data-url');
          window.open(imageUrl, '_blank'); // Ouvre l'image dans un nouvel onglet
        });
      });
  
      // Ajouter un écouteur pour le bouton "Supprimer"
      document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async function () {
          const docId = this.getAttribute('data-id');
          if (confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
            try {
              await deleteDoc(doc(collection(db, "imprimerie"), docId)); // Suppression de Firestore
              fetchAndDisplayData(); // Rafraîchir la table après suppression
              showToast("Image supprimée avec succès.");
            } catch (error) {
              console.error("Erreur lors de la suppression de l'image : ", error);
              showToast("Erreur lors de la suppression de l'image.", true);
            }
          }
        });
      });
  
    } catch (error) {
      console.error("Erreur lors de la récupération des données : ", error);
      showToast("Erreur lors de la récupération des données.", true);
    }
  }
  
  // Charger les données au démarrage
  document.addEventListener('DOMContentLoaded', fetchAndDisplayData);
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  