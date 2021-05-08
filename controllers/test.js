exports.sauceLike = (req,res,next)=>{
    let like = req.body.like;
    let user = req.body.userId;
    let sauceId = req.params.id;
    
    Sauce.findOne({_id: sauceId})
    .then(sauce => {
        switch(like){
            case 1:
              if(sauce.usersLiked.includes(user)){
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
              } 
            break;
            case -1:
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
            case 0 : console.log(sauce.usersLiked.include(user))
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
                      $inc:{likes: -1},
                      $pull:{ usersLiked: user},
                      _id: sauceId, 
                    }
                  )
                  .then(()=>res.status(200).json({message:"like retiré !"}))
                  .catch(error=>res.status(400).json({error}))
              }
            break;
        }
          
    })
    .catch(error=>res.status(400).json({error}))
};