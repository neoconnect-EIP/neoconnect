const express = require("express");
const router = express.Router();

router.get("/actuality", actuality);
router.post("/follow/:id", follow);
router.get("/suggestion", getSuggestion);

router.post("/choiceApply", choiceApply);
router.post("/sharePublication/:id", sharePublication);
router.get("/suggestionOffer", suggestionOffre);

module.exports = router;

function actuality(req, res, next) {

    //creer un champ nbr de visite dans la db pour comptailiser le nombre de visite de chaque compte utilisateur et offre quand get id

    //decoder le token si inf envoyer  5 offre et 5 shop (plus grand nombre de visite),
    // si shop envoyer les inf

    //'id', 'pseudo', 'userType', 'full_name', 'email', 'phone', 'postal', 'city', 'theme',
    //            'sexe','pinterest','twitch','youtube','facebook', 'twitter', 'snapchat', 'instagram', 'userDescription'

    res.status(200).json(
        [
        {
            'id': 1,
            'pseudo': 'jordan',
            'userType': 'shop',
            'full_name': 'jordan mick',
            'email': 'jordan@jordan.com',
            'phone': '0102030405',
            'postal': '75001',
            'city': 'Paris',
            'theme': 'sport',
            'sexe': 'male',
            'pinterest': null,
            'twitch': null,
            'youtube': null,
            'facebook': null,
            'twitter': null,
            'snapchat': null,
            'instagram': null,
            'userDescription': '',
            "userPicture": [
                {
                    "idLink": "51",
                    "imageName": "51_Boss",
                    "imageData": "http://localhost:8080/image/User_51_51_Boss.png"
                }
            ],
            "average": null,
            "comment": [],
            "mark": []
        },
        {
            "id": 51,
            "pseudo": "Boss",
            "userType": "shop",
            "full_name": "Hugo Boss",
            "email": "hugo-boss@boss.com",
            "phone": "0145323412",
            "postal": "75001",
            "city": "Paris",
            "userDescription": "Magasin de vetement, chaussure, parfun",
            "theme": "mode",
            "society": "Boss entreprise",
            "function": "Boutique",
            "website": null,
            "twitter": null,
            "facebook": null,
            "snapchat": null,
            "instagram": null,
            "userPicture": null,
            "average": null,
            "comment": [],
            "mark": []
        }
        ]
    )
}

function follow(req, res, next) {
	//envoyer un mail a tout les inf qui folow le shop quand il poste une nouvelle offre

    //creation d'une table

    res.status(200).json("Follow success")
}

function getSuggestion(req, res, next) {

    // renvoie des 5 premier user avec le meme theme

    res.status(200).json([
        {
            'id': 1,
            'pseudo': 'jordan',
            'userType': 'shop',
            'full_name': 'jordan mick',
            'email': 'jordan@jordan.com',
            'phone': '0102030405',
            'postal': '75001',
            'city': 'Paris',
            'theme': 'sport',
            'sexe': 'male',
            'pinterest': null,
            'twitch': null,
            'youtube': null,
            'facebook': null,
            'twitter': null,
            'snapchat': null,
            'instagram': null,
            'userDescription': '',
            "userPicture": [
                {
                    "idLink": "51",
                    "imageName": "51_Boss",
                    "imageData": "http://localhost:8080/image/User_51_51_Boss.png"
                }
            ],
            "average": null,
            "comment": [],
            "mark": []
        },
        {
            "id": 51,
            "pseudo": "Boss",
            "userType": "shop",
            "full_name": "Hugo Boss",
            "email": "hugo-boss@boss.com",
            "phone": "0145323412",
            "postal": "75001",
            "city": "Paris",
            "userDescription": "Magasin de vetement, chaussure, parfun",
            "theme": "mode",
            "society": "Boss entreprise",
            "function": "Boutique",
            "website": null,
            "twitter": null,
            "facebook": null,
            "snapchat": null,
            "instagram": null,
            "userPicture": null,
            "average": null,
            "comment": [],
            "mark": []
        }
    ])
}

function choiceApply(req, res, next) {

    // body userId, idOffre, choice true or false

    // un shop pourra accepter ou refuser les apply des inf

    // envoie d'une notif a l'inf si accepter ou refuser

    // ajout d'un champ dans la table apply (champ: status)

    res.status(200).json("response success")
}

function sharePublication(req, res, next) {

    // post share publication avec id Offre,

    // cette request prend en body les url des lien de post des inf sur les reseau sociaux

    // par la suite un mail est envoyer au shop avec les lien de ces post sur les reseau.

    res.status(200).json("Share Success");
}

function suggestionOffre(req, res, next) {

    // renvoie des 5 premier offre avec le meme theme et  productSubject que le user.

    res.status(200).json([
        {
        "id": 1,
        "idUser": 27,
        "productImg": [
            {
                "idLink": "1",
                "imageName": "tee-shirt",
                "imageData": "http://localhost:8080/image/Offer_1_tee-shirt.png"
            },
            {
                "idLink": "1",
                "imageName": "model",
                "imageData": "http://localhost:8080/image/Offer_1_model.png"
            },
            {
                "idLink": "1",
                "imageName": "model2",
                "imageData": "http://localhost:8080/image/Offer_1_model2.png"
            }
        ],
        "productName": "T-shirt Regular Fit avec motif artistique de la nouvelle saison",
        "productSex": "Male",
        "productDesc": "Un t-shirt à manches courtes BOSS Homme, confectionné en coton à la finition douce pour plus de confort. Ce t-shirt Regular Fit est orné d’un motif artistique expressif sur la poitrine emblématique de la nouvelle saison.",
        "productSubject": null,
        "brand": null,
        "color": null,
        "createdAt": "2020-05-28T09:23:03.669Z",
        "updatedAt": "2020-05-28T09:36:10.769Z",
        "average": null,
        "comment": []
    },
    {
            "id": 2,
            "idUser": 2,
        "productImg": null,
        "productName": "T-shirt Regular Fit avec motif artistique de la nouvelle saison",
        "productSex": "Male",
        "productDesc": "Un t-shirt à manches courtes BOSS Homme, confectionné en coton à la finition douce pour plus de confort. Ce t-shirt Regular Fit est orné d’un motif artistique expressif sur la poitrine emblématique de la nouvelle saison.",
        "productSubject": null,
        "brand": null,
        "color": null,
        "createdAt": "2020-05-28T09:23:03.669Z",
        "updatedAt": "2020-05-28T09:36:10.769Z",
        "average": null,
        "comment": []
    }
    ])
}

