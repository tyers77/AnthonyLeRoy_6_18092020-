const Sauce = require('../models/Sauce');
const User = require('../models/User');
const fs = require('fs');

exports.createSauce = (req,res,next)=> {
    const sauceObjet = JSON.parse(req.body.sauce);
    delete sauceObjet._id;
    const sauce = new Sauce({
        ...sauceObjet,
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,//création de l url de l'image
        /*likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []*/
    });
    sauce.save() //appel de la méthode save qui renvoi une promise donc .then et .catch
    .then(()=>res.status(201).json({message: "sauce crée"})) //renvoi d'une réponse eite l'expiration de la requète
    .catch(error => res.status(400).json({ error }));

};

exports.modifySauce = (req,res,next) => { //saucefindOne pour remplacer l image et supprimer l ancienne
    if(req.file){ Sauce.findOne({_id:req.params.id})
    .then(sauce=>{
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`,()=>{})
    })
    .catch(() => res.status(403).json({message:"non modifié !"}))
}        
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //update permet de modifier en recuperant l objet par son id
    .then(()=> res.status(200).json({message:"sauce modifiée"}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req,res,next)=>{
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({message:"sauce supprimée"}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req,res,next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};

exports.getAllSauces = (req,res,next) => {
  //Sauce.exists()
  //console.log(Sauce.exists());
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch(error => res.status(403).json({error}));
   
};

exports.sauceLike = (req,res,next)=>{
  let like = req.body.likes;
  let user = req.body.userId;
  let sauceId = req.params.id;
    
    Sauce.findOne({_id: sauceId})
    .then(sauce => {
        switch(like){
            case 1:console.log(sauce.usersLiked.length, sauce.usersDisliked.length)
              if(sauce.usersLiked.includes(user)){
                sauce.usersLiked.push(user)

                Sauce.updateOne(
                  {_id:sauceId},
                  {
                    $inc: {likes: +1},
                    $push:{usersLiked: user},
                    _id: sauceId,
                  }
                )
                .then(()=>res.status(200).json({message:"like ajouté"}))
                .catch(error=>res.status(400).json({error}));
                console.log(sauce.usersLikes.length)
              } 
            break;
            
            case -1:console.log(sauce.usersLiked.length, sauce.usersDisliked.length)
              if(sauce.usersDisliked.includes(user)){
                Sauce.updateOne(
                  {_id:sauceId},
                  {
                    $inc:{dislikes:-1},
                    $push:{usersdisliked:user},
                    _id: sauceId,
                  }
                )
                .then(()=>res.status(200).json({message:"dislike ajouté !"}))
                .catch(error=>res.status(400).json({error}))
              }  
            break;
            
            case 0 : console.log(sauce.usersLiked.length)
            if (sauce.usersDisliked.includes(user)) {
                //si l'id de l'utilisateur est dans le tableau usersDisliked
                Sauce.updateOne(
                  { _id: sauceId },
                  {
                    $inc: { dislikes: -1 },
                    $pull: { usersDisliked: user },
                    _id: sauceId,//pour assurer 
                  }
                ).then(() => res.status(200).json({ message: "Dislike retiré !" }))
                .catch(error=>res.status(400).json({error}))
              } 
              
              if(sauce.usersLiked.includes(user)){
                  Sauce.updateOne(
                    {_id: sauceId},
                    {
                      $pull:{ usersLiked: user},
                      $inc:{likes: -1},
                      
                     _id: sauceId, 
                    }
                  )
                  .then(()=>res.status(200).json({message:"like retiré !"}))
                  .catch(error=>res.status(400).json({error}))
              }
            break;
                
        }
        sauce.likes = sauce.usersLiked.length;
			  sauce.disLikes = sauce.usersDisliked.length;
			  sauce.save(sauce)
			    .then((sauce) => res.status(200).json({message: "Done !"}))
			    .catch(error => {res.status(403).json({ error })});  
    })
    .catch(error=>res.status(400).json({error}));
  }