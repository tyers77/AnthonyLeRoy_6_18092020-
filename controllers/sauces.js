const Sauce = require('../models/Sauce');
const fs = require('fs'); //gestionnaire de fichier
const sanitize = require("mongo-sanitize");

exports.createSauce = (req, res, next) => {
  let sauceBody = sanitize(req.body.sauce);
  const sauceObjet = JSON.parse(sauceBody);
  delete sauceObjet._id;
  const sauce = new Sauce({
    ...sauceObjet,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,//création de l url de l'image
  });
  sauce.save() //appel de la méthode save qui renvoi une promise donc .then et .catch
    .then(() => res.status(201).json({ message: "sauce crée" })) //renvoi d'une réponse evite l'expiration de la requète
    .catch(error => res.status(400).json({ error }));

};

exports.modifySauce = (req, res, next) => { //saucefindOne pour remplacer l image et supprimer l ancienne
  let sauceId = sanitize(req.params.id);
  let sauceBody = sanitize(req.body.sauce);

  if (req.file) {
    Sauce.findOne({ _id: sauceId })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => { })
      })
      .catch(() => res.status(403).json({ message: "non modifié !" }))
  }
  const sauceObject = req.file ?
    {
      ...JSON.parse(sauceBody),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: sauceId }, { ...sauceObject, _id: sauceId }) //update permet de modifier en recuperant l objet par son id
    .then(() => res.status(200).json({ message: "sauce modifiée" }))
    .catch(error => res.status(400).json({ message: "non modifié !" }));
};


exports.deleteSauce = (req, res, next) => {
  let sauceId = sanitize(req.params.id);
  Sauce.findOne({ _id: sauceId })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: sauceId })
          .then(() => res.status(200).json({ message: "sauce supprimée" }))
          .catch(error => res.status(400).json({ message: "sauce non supprimée" }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  let sauceId = sanitize(req.params.id);
  Sauce.findOne({ _id: sauceId })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch(error => res.status(403).json({ error }));

};

exports.sauceLike = (req, res, next) => {
  let like = sanitize(req.body.like);
  let user = sanitize(req.body.userId);
  let sauceId = sanitize(req.params.id);

  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      switch (like) {
        case 1:
          if (!sauce.usersLiked.includes(user)){
          Sauce.updateOne(
            { _id: sauceId },
            {
              $inc: { likes: +1 },
              $push: { usersLiked: user },
              _id: sauceId,//pour assurer
            })
            .then(() => res.status(200).json({ message: "like ajouté" }))
            .catch(error => res.status(400).json({ error }));
          }
          break;

        case -1:
          if (!sauce.usersDisliked.includes(user)) {
          Sauce.updateOne(
            { _id: sauceId },
            {
              $inc: { dislikes: +1 },
              $push: { usersDisliked: user },
              _id: sauceId,
            }
          )
            .then(() => res.status(200).json({ message: "dislike ajouté !" }))
            .catch(error => res.status(400).json({ error }));
          }
          break;

        case 0:
          if (sauce.usersDisliked.includes(user)) { //si l'id de l'utilisateur est dans le tableau usersDisliked 
            Sauce.updateOne(
              { _id: sauceId },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: user },
                _id: sauceId,
              }
            ).then(() => res.status(200).json({ message: "Dislike retiré !" }))
              .catch(error => res.status(400).json({ error }))
          }
          if (sauce.usersLiked.includes(user)) {
            Sauce.updateOne(
              { _id: sauceId },
              {
                $pull: { usersLiked: user },
                $inc: { likes: -1 },
                _id: sauceId,
              }
            )
              .then(() => res.status(200).json({ message: "like retiré !" }))
              .catch(error => res.status(400).json({ error }))
          }
          break;
      }
    })
    .catch(error => res.status(400).json({ error }));
}

/*exports.sauceLike = (req, res, next) => {
  let like = sanitize(req.body.like)
  let userId = sanitize(req.body.userId)
  let sauceId = sanitize(req.params.id)

  if (like === 1) {
    Sauce.updateOne({ _id: sauceId},
      {
          $push: {usersLiked: userId},
          $inc: {likes: +1}
      })
      .then(() => res.status(200).json({message: 'Like ajouté '}))
      .catch((error) => res.status(400).json({error}))
  }

  if (like === -1) {
    Sauce.updateOne({ _id: sauceId}, {
          $push: {usersDisliked: userId},
          $inc: {dislikes: +1},
        })
      .then(() => res.status(200).json({message: 'Dislike ajouté '}))
      .catch((error) => res.status(400).json({error}))
  }
 
  if (like === 0) {
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne({_id: sauceId}, {
              $pull: {usersLiked: userId},
              $inc: {likes: -1},
            })
            .then(() => res.status(200).json({message: 'Like annulé '}))
            .catch((error) => res.status(400).json({error}))
        }
        if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne({ _id: sauceId}, {
              $pull: {usersDisliked: userId},
              $inc: {dislikes: -1},
            })
            .then(() => res.status(200).json({message: 'Dislike annulé '}))
            .catch((error) => res.status(400).json({error}))
        }
      })
      .catch((error) => res.status(404).json({error}))
  }
}
*/