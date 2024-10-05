document.addEventListener("DOMContentLoaded", function () {
  // Liste des paires id de boutons et id des divs correspondantes
  const services = [
    { buttonId: "broderiebutton", descId: "broderiedesc" },
    { buttonId: "imprimeriebutton", descId: "imprimeriedesc" },
    { buttonId: "serigaphiebutton", descId: "sérigraphiedesc" },
    { buttonId: "tampographiebutton", descId: "tampographiedesc" },
    { buttonId: "signalétiquebutton", descId: "signalétiquedesc" },
    { buttonId: "packagingbutton", descId: "packagingdesc" },
  ];

  // Fonction pour masquer toutes les descriptions
  function hideAllDescriptions() {
    services.forEach((service) => {
      const descElement = document.getElementById(service.descId);
      descElement.style.display = "none";
    });
  }

  // Fonction pour retirer la classe active de tous les boutons
  function resetButtonStyles() {
    services.forEach((service) => {
      const button = document.getElementById(service.buttonId);
      button.classList.remove("active-button"); // Retire la classe active
    });
  }

  // Boucle pour ajouter des écouteurs de clic sur chaque bouton
  services.forEach((service) => {
    const button = document.getElementById(service.buttonId);
    button.addEventListener("click", function () {
      hideAllDescriptions(); // Masque toutes les descriptions
      resetButtonStyles();   // Réinitialise les styles des boutons

      // Affiche la description correspondante
      const descElement = document.getElementById(service.descId);
      descElement.style.display = "block";

      // Ajoute la classe active au bouton cliqué
      button.classList.add("active-button");
    });
  });

  // Affiche la description de la broderie par défaut et applique le style au bouton
  const defaultDesc = document.getElementById("broderiedesc");
  defaultDesc.style.display = "block";
  document.getElementById("broderiebutton").classList.add("active-button");
});
