document
      .getElementById("imageForm")
      ?.addEventListener("submit", function (event) {
        event.preventDefault();

        const imageUpload = document.getElementById("imageUpload").files[0];
        const imageName = document.getElementById("imageName").value;
        const imageDescription = document.getElementById("imageDescription").value;

        if (imageUpload && imageName && imageDescription) {
          alert(
            "Formulaire soumis avec succès !\n\nNom de l'image : " +
              imageName +
              "\nDescription : " +
              imageDescription
          );
          // Vous pouvez traiter le téléchargement ici, par exemple en utilisant un backend pour stocker l'image
        } else {
          alert("Veuillez remplir tous les champs.");
        }
      });