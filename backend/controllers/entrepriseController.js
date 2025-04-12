const streamifier = require('streamifier');
const cloudinary = require('../utils/cloudinary');
const Entreprise = require('../models/Entreprise');
const multer = require('multer');

exports.addEntreprise = async (req, res) => {
  try {
    console.log("Début de la création de l'entreprise");

    const { nom, secteur, localisation, description } = req.body;
    console.log('Données reçues:', { nom, secteur, localisation, description });

    // Vérification que tous les champs obligatoires sont présents
    if (!nom || !secteur || !localisation || !description) {
      console.log("Données manquantes:", { nom, secteur, localisation, description });
      return res.status(400).send("Tous les champs sont requis.");
    }

    // Vérification de l'image envoyée
    if (!req.file) {
      console.log("Aucun fichier fourni, image non envoyée");
    }

    // Upload vers Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' }, // Auto détecte le type de fichier (image, PDF, etc.)
      async (error, result) => {
        if (error) {
          console.error('Erreur lors de l\'upload vers Cloudinary:', error);
          return res.status(500).send('Erreur Cloudinary');
        }

        console.log('Fichier uploadé avec succès sur Cloudinary:', result);

        const newEntreprise = new Entreprise({
          nom,
          secteur,
          localisation,
          description,
          image: result ? result.secure_url : '' // Si pas d'image, on laisse le champ vide
        });

        try {
          console.log("Tentative de sauvegarde de l'entreprise:", newEntreprise);
          await newEntreprise.save();
          console.log('Entreprise ajoutée avec succès:', newEntreprise);
          res.status(201).send('Entreprise ajoutée avec succès.');
        } catch (saveError) {
          console.error('Erreur lors de l\'enregistrement de l\'entreprise:', saveError);
          return res.status(500).send('Erreur serveur lors de l\'enregistrement de l\'entreprise');
        }
      }
    );

    // Conversion du fichier en stream et envoi vers Cloudinary
    if (req.file) {
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      // Si aucune image n'est envoyée, on procède à la création sans image
      const newEntreprise = new Entreprise({
        nom,
        secteur,
        localisation,
        description,
        image: '' // Pas d'image
      });
      
      await newEntreprise.save();
      res.status(201).send('Entreprise ajoutée sans image');
    }

  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).send('Erreur serveur');
  }
};

// Récupérer toutes les entreprises
exports.getEntreprises = async (req, res) => {
  try {
    const entreprises = await Entreprise.find();
    res.status(200).json(entreprises);
  } catch (error) {
    console.error('Erreur lors de la récupération des entreprises:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer une entreprise par son ID
exports.getEntrepriseById = async (req, res) => {
  try {
    const entreprise = await Entreprise.findById(req.params.id);
    if (!entreprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }
    res.status(200).json(entreprise);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'entreprise:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour une entreprise
exports.updateEntreprise = async (req, res) => {
  try {
    const entreprise = await Entreprise.findById(req.params.id);
    if (!entreprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }

    // Mise à jour des champs
    entreprise.nom = req.body.nom || entreprise.nom;
    entreprise.secteur = req.body.secteur || entreprise.secteur;
    entreprise.localisation = req.body.localisation || entreprise.localisation;
    entreprise.description = req.body.description || entreprise.description;

    // Mise à jour de l'image si une nouvelle est envoyée
    if (req.file) {
      entreprise.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    await entreprise.save();
    res.status(200).json({ message: 'Entreprise mise à jour avec succès', entreprise });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'entreprise:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// Supprimer une entreprise
exports.deleteEntreprise = async (req, res) => {
  try {
    const deletedEntreprise = await Entreprise.findByIdAndDelete(req.params.id);

    if (!deletedEntreprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }

    // Supprimer l'image du serveur
    const imagePath = path.join(__dirname, '..', 'uploads', deletedEntreprise.image.split('/').pop());
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: 'Entreprise supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'entreprise:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
