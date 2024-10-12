// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDuYGSb0vUmEo65Cxa8arb4r1bqCJNSrjM",
  authDomain: "mtssarl-28760.firebaseapp.com",
  projectId: "mtssarl-28760",
  storageBucket: "mtssarl-28760.appspot.com",
  messagingSenderId: "998114514636",
  appId: "1:998114514636:web:8c293f113eba41461f1469",
  measurementId: "G-WN8P24DMEJ",
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

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Empêche le rechargement de la page
    const createAccountBtn = document.getElementById("createAccountBtn");
    const spinner = document.getElementById("spinner");
    spinner.style.display = "inline-block"; // Affiche le spinner
    createAccountBtn.disabled = true; // Désactive le bouton

    const formData = {
      email: document.getElementById("emailconnect").value,
      password: document.getElementById("passwordconnect").value,
    };

    // Vérifier si les identifiants existent dans la collection admin
    const q = query(
      collection(db, "admin"),
      where("email", "==", formData.email),
      where("password", "==", formData.password)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Un partenaire avec les mêmes informations existe
      // Afficher la modale de succès
      document.getElementById("successModal").style.display = "block";
      document.body.classList.add("no-scroll"); // Désactiver le scroll
      spinner.style.display = "none";
      createAccountBtn.disabled = false;

      // Fermer automatiquement la modale après 3 secondes
      setTimeout(function () {
        document.getElementById("myModal").style.display = "none";
        document.body.classList.remove("no-scroll"); // Réactiver le scroll
      }, 3000); // 3000 millisecondes = 3 secondes
    } else {
      // Les informations d'identification sont incorrectes
      showToast("Identifiants incorrects !", true);
      spinner.style.display = "none";
      createAccountBtn.disabled = false;
    }
  });

// Fonction pour fermer la modale manuellement
document
  .getElementById("closeSuccessModal")
  .addEventListener("click", function () {
    document.getElementById("successModal").style.display = "none";
    document.body.classList.remove("no-scroll"); // Réactiver le scroll
  });

// Fonction générique pour gérer la soumission d'un formulaire
function handleFormSubmit(
  formId,
  imageUploadId,
  imageNameId,
  imageDescriptionId,
  collectionName,
  spinnerId,
  tableId,
  filterName
) {
  document
    .getElementById(formId)
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      // Récupérer les éléments du formulaire
      const imageFile = document.getElementById(imageUploadId).files[0];
      const imageName = document.getElementById(imageNameId).value;
      const imageDescription =
        document.getElementById(imageDescriptionId).value;

      // Spinner d'attente
      const spinner = document.getElementById(spinnerId);
      spinner.style.display = "inline-block";

      // Vérifier si une image a été sélectionnée
      if (!imageFile) {
        showToast("Veuillez sélectionner une image.", true);
        spinner.style.display = "none";
        return;
      }

      try {
        // Référence de stockage pour l'image
        const storageRef = ref(storage, "images/" + imageFile.name);

        // Uploader l'image dans Firebase Storage
        const snapshot = await uploadBytes(storageRef, imageFile);

        // Obtenir l'URL de téléchargement de l'image
        const imageUrl = await getDownloadURL(snapshot.ref);

        // Enregistrer les informations dans Firestore
        await addDoc(collection(db, collectionName), {
          imageUrl,
          imageName,
          imageDescription,
        });

        // Réinitialiser le formulaire
        document.getElementById(formId).reset();
        showToast("Image téléchargée avec succès !");

        // Réafficher les données dans le tableau et la galerie
        fetchAndDisplayData(collectionName, tableId, filterName);
      } catch (error) {
        console.error("Erreur lors du téléchargement de l'image : ", error);
        showToast("Erreur lors du téléchargement de l'image.", true);
      }

      // Cacher le spinner
      spinner.style.display = "none";
    });
}

// Fonction générique pour récupérer et afficher les données dans le tableau et le portfolio
async function fetchAndDisplayData(collectionName, tableId, filtername) {
  const tableBody = document.querySelector(`#${tableId} tbody`);
  const portfolioContainer = document.querySelector(".portfolio-container"); // Conteneur du portfolio
  tableBody.innerHTML = ""; // Vider le tableau
  portfolioContainer.innerHTML = ""; // Vider le portfolio

  try {
    const querySnapshot = await getDocs(collection(db, collectionName));

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const fileName = data.imageUrl.split("/").pop(); // Extraire le nom du fichier de l'URL

      // Ajouter une ligne au tableau
      const row = `
        <tr>
          <td>${fileName}</td> <!-- Afficher uniquement le nom du fichier -->
          <td>${data.imageName}</td>
          <td>${data.imageDescription}</td>
          <td>
            <button class="view-btn" data-url="${data.imageUrl}">Voir</button>
            <button class="delete-btn" data-id="${doc.id}" data-collection="${collectionName}">Supprimer</button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;

      // Ajouter une carte au portfolio
      const portfolioItem = `
        <div class="col-lg-4 col-md-6 portfolio-item isotope-item ${filtername}">
          <div class="portfolio-content h-100">
            <a href="" data-gallery="portfolio-gallery-app" class="glightbox">
            <img src="${data.imageUrl}" class="img-fluid" alt="${data.imageName}">
          <div>
          <div class="portfolio-info">
            <h4><a href="${collectionName}.html" title="More Details">${data.imageName} </a> </h4>
            <p>${data.imageDescription}</p>
          </div>
          </div>
        </div>
      `;
      portfolioContainer.innerHTML += portfolioItem;
    });

    // Ajouter un écouteur pour le bouton "Voir"
    document.querySelectorAll(".view-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const imageUrl = this.getAttribute("data-url");
        window.open(imageUrl, "_blank"); // Ouvre l'image dans un nouvel onglet
      });
    });

    // Ajouter un écouteur pour le bouton "Supprimer" avec un spinner
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async function () {
        const docId = this.getAttribute("data-id");
        const collectionName = this.getAttribute("data-collection");
        const deleteButton = this; // Référence au bouton cliqué
        if (confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
          try {
            // Ajouter le spinner et désactiver le bouton
            deleteButton.disabled = true;
            const originalText = deleteButton.innerHTML;
            deleteButton.innerHTML = `<div class="spinner"></div> Suppression...`;

            // Suppression de Firestore
            await deleteDoc(doc(collection(db, collectionName), docId));

            fetchAndDisplayData(collectionName, tableId, filtername); // Rafraîchir la table après suppression
            showToast("Image supprimée avec succès.");
          } catch (error) {
            console.error("Erreur lors de la suppression de l'image : ", error);
            showToast("Erreur lors de la suppression de l'image.", true);
          } finally {
            // Réinitialiser le bouton après la suppression
            deleteButton.disabled = false;
            deleteButton.innerHTML = originalText;
          }
        }
      });
    });

    // Initialiser Isotope après le chargement des images
    document
      .querySelectorAll(".isotope-layout")
      .forEach(function (isotopeItem) {
        let layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
        let filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
        let sort = isotopeItem.getAttribute("data-sort") ?? "original-order";

        let initIsotope;
        imagesLoaded(
          isotopeItem.querySelector(".isotope-container"),
          function () {
            initIsotope = new Isotope(
              isotopeItem.querySelector(".isotope-container"),
              {
                itemSelector: ".isotope-item",
                layoutMode: layout,
                filter: filter,
                sortBy: sort,
              }
            );
          }
        );

        // Ajouter les écouteurs pour filtrer les éléments
        isotopeItem
          .querySelectorAll(".isotope-filters li")
          .forEach(function (filters) {
            filters.addEventListener(
              "click",
              function () {
                isotopeItem
                  .querySelector(".isotope-filters .filter-active")
                  .classList.remove("filter-active");
                this.classList.add("filter-active");
                initIsotope.arrange({
                  filter: this.getAttribute("data-filter"),
                });
                if (typeof aosInit === "function") {
                  aosInit();
                }
              },
              false
            );
          });
      });
  } catch (error) {
    console.error("Erreur lors de la récupération des données : ", error);
    showToast("Erreur lors de la récupération des données.", true);
  }
}

// Charger les données pour chaque collection au démarrage
document.addEventListener("DOMContentLoaded", function () {
  fetchAndDisplayData("broderie", "productTable1", "filter-app");
  fetchAndDisplayData("imprimerie", "productTable2", "filter-product");
  fetchAndDisplayData("serigraphie", "productTable3", "filter-books");
  fetchAndDisplayData("signaletique", "productTable4", "filter-signal");
  fetchAndDisplayData("tampographie", "productTable5", "filter-tampo");
  fetchAndDisplayData("packaging", "productTable6", "filter-branding");
});

// Ajouter les gestionnaires de soumission de formulaire pour chaque collection
handleFormSubmit(
  "imageFormbroderie",
  "imageUpload1",
  "imageName1",
  "imageDescription1",
  "broderie",
  "spinner1",
  "productTable1",
  "filter-app"
);
handleFormSubmit(
  "imageFormimprimerie",
  "imageUpload2",
  "imageName2",
  "imageDescription2",
  "imprimerie",
  "spinner2",
  "productTable2",
  "filter-product"
);
handleFormSubmit(
  "imageFormserigraphie",
  "imageUpload3",
  "imageName3",
  "imageDescription3",
  "serigraphie",
  "spinner3",
  "productTable3",
  "filter-books"
);
handleFormSubmit(
  "imageFormsignaletique",
  "imageUpload4",
  "imageName4",
  "imageDescription4",
  "signaletique",
  "spinner4",
  "productTable4",
  "filter-signal"
);
handleFormSubmit(
  "imageFormtampographie",
  "imageUpload5",
  "imageName5",
  "imageDescription5",
  "tampographie",
  "spinner5",
  "productTable5",
  "filter-tampo"
);
handleFormSubmit(
  "imageFormpackaging",
  "imageUpload6",
  "imageName6",
  "imageDescription6",
  "packaging",
  "spinner6",
  "productTable6",
  "filter-branding"
);

//
//
//
//

// Fonction générique pour gérer la soumission d'un formulaire
function handleFormSubmitteam(
  formId,
  imageUploadId,
  imageNameId,
  imageDescriptionId,
  infotel,
  collectionName,
  spinnerId,
  tableId
) {
  document
    .getElementById(formId)
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      // Récupérer les éléments du formulaire
      const imageFile = document.getElementById(imageUploadId).files[0];
      const imageName = document.getElementById(imageNameId).value;
      const imageDescription =
        document.getElementById(imageDescriptionId).value;
      const telephone = document.getElementById(infotel).value;

      // Spinner d'attente
      const spinner = document.getElementById(spinnerId);
      spinner.style.display = "inline-block";

      // Vérifier si une image a été sélectionnée
      if (!imageFile) {
        showToast("Veuillez sélectionner une image.", true);
        spinner.style.display = "none";
        return;
      }

      try {
        // Référence de stockage pour l'image
        const storageRef = ref(storage, "images/" + imageFile.name);

        // Uploader l'image dans Firebase Storage
        const snapshot = await uploadBytes(storageRef, imageFile);

        // Obtenir l'URL de téléchargement de l'image
        const imageUrl = await getDownloadURL(snapshot.ref);

        // Enregistrer les informations dans Firestore
        await addDoc(collection(db, collectionName), {
          imageUrl,
          imageName,
          imageDescription,
          telephone,
          createdAt: serverTimestamp(), // Ajouter un champ de timestamp
        });

        // Réinitialiser le formulaire
        document.getElementById(formId).reset();
        showToast("Image téléchargée avec succès !");

        // Réafficher les données dans le tableau et la galerie
        fetchAndDisplayDataInfo(collectionName, tableId);
      } catch (error) {
        console.error("Erreur lors du téléchargement de l'image : ", error);
        showToast("Erreur lors du téléchargement de l'image.", true);
      }

      // Cacher le spinner
      spinner.style.display = "none";
    });
}

async function fetchAndDisplayDataInfo(collectionName, tableId) {
  const tableBody = document.querySelector(`#${tableId} tbody`);
  const ContainerInfo = document.querySelector(".team-info"); // Conteneur du portfolio
  tableBody.innerHTML = ""; // Vider le tableau
  ContainerInfo.innerHTML = ""; // Vider le portfolio

  try {
    // Créer une requête pour récupérer les données triées par 'createdAt'
    const q = query(collection(db, collectionName), orderBy('createdAt', 'asc')); // Trier dans l'ordre croissant (insertion la plus ancienne en premier)
    const querySnapshot = await getDocs(q); // Utiliser la requête triée

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const fileName = data.imageUrl.split("/").pop(); // Extraire le nom du fichier de l'URL

      // Ajouter une ligne au tableau
      const row = `
        <tr>
          <td>${fileName}</td> <!-- Afficher uniquement le nom du fichier -->
          <td>${data.imageName}</td>
          <td>${data.imageDescription}</td>
          <td>${data.telephone}</td>
          <td>
            <button class="view-btn" data-url="${data.imageUrl}">Voir</button>
            <button class="delete-btn" data-id="${doc.id}" data-collection="${collectionName}">Supprimer</button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;

      // Ajouter une carte au portfolio
      const portfolioItem = `
          <div class="col-xl-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="100">
              <div class="member">
                <img src="${data.imageUrl}" class="img-fluid" alt="image de ${data.imageName}">
                <h4>${data.imageName}</h4>
                <span>${data.imageDescription}</span>
                <div class="social">
                  <a href="https://wa.me/${data.telephone}"><i class="bi bi-whatsapp"></i></a>
                </div>
              </div>
            </div>
      `;
      ContainerInfo.innerHTML += portfolioItem;
    });

    // Ajouter un écouteur pour le bouton "Voir"
    document.querySelectorAll(".view-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const imageUrl = this.getAttribute("data-url");
        window.open(imageUrl, "_blank"); // Ouvre l'image dans un nouvel onglet
      });
    });

    // Ajouter un écouteur pour le bouton "Supprimer" avec un spinner
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async function () {
        const docId = this.getAttribute("data-id");
        const collectionName = this.getAttribute("data-collection");
        const deleteButton = this; // Référence au bouton cliqué
        if (confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
          try {
            // Ajouter le spinner et désactiver le bouton
            deleteButton.disabled = true;
            const originalText = deleteButton.innerHTML;
            deleteButton.innerHTML = `<div class="spinner"></div> Suppression...`;

            // Suppression de Firestore
            await deleteDoc(doc(collection(db, collectionName), docId));

            fetchAndDisplayData(collectionName, tableId); // Rafraîchir la table après suppression
            showToast("Image supprimée avec succès.");
          } catch (error) {
            console.error("Erreur lors de la suppression de l'image : ", error);
            showToast("Erreur lors de la suppression de l'image.", true);
          } finally {
            // Réinitialiser le bouton après la suppression
            deleteButton.disabled = false;
            deleteButton.innerHTML = originalText;
          }
        }
      });
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données : ", error);
    showToast("Erreur lors de la récupération des données.", true);
  }
}


document.addEventListener("DOMContentLoaded", function () {
  fetchAndDisplayDataInfo("team", "productTable7");
});


handleFormSubmitteam(
  "imageFormteam",
  "imageUpload7",
  "imageName7",
  "imageDescription7",
  "telpersonel",
  "team",
  'spinner7',
  "productTable7"
)