const   db = require("../_helpers/db"),
        fs = require('fs'),
        bcrypt = require("bcrypt"),
        User = db.Influencer,
        Offer = db.Offre,
        Shop = db.Shop,
        Image = db.Image,
        jwtUtils = require("../utils/jwt.utils");

folderImage = (data) => {
    if (!fs.existsSync(__dirname + '/../image')) {
        fs.mkdirSync(__dirname + '/../image');
    }
    let Data = JSON.parse(data.image);
    for (let i = 0; i !== Data.image.length; i++) {
        fs.writeFileSync(`${__dirname}/../image/${data.type}_${data.idLink}_${Data.image[i].imageName}`, Data.image[i].imageData);
    }
};

const uploadImage = async (req) => {
    if (req.image === undefined)
        return (undefined);
    let dataId = [];
    const tmp = JSON.parse(req.image);
    for (let i = 0; i !== tmp.image.length; i++) {
        let data = await Image.create({
            ImageName: tmp.image[i].imageName,
            Type: req.type,
            IdLink: req.idLink
        });
        dataId.push(data.id);
    }
    if (req.type === 'Offer') {
        let CurrentOffer = await Offer.findOne({
            where: {id: req.idLink}
        });
        CurrentOffer.productImg = dataId;
        CurrentOffer.save().then(() => {});
    }
    folderImage(req);
    return (req);
};

getDataImage = (data) => {
    let imageDataFile = [];
    for (let i = 0; i < data.length; i++) {
        if (!fs.existsSync(`${__dirname}/../image/${data[i].dataValues.Type}_${data[i].dataValues.IdLink}_${data[i].dataValues.ImageName}`)) {
            continue;
        }
        imageDataFile[i] = {
            idLink: data[i].dataValue.IdLink,
            imageName: data[i].dataValues.ImageName,
            imageData: fs.readFileSync(`${__dirname}/../image/${data[i].dataValues.Type}_${data[i].dataValues.IdLink}_${data[i].dataValues.ImageName}`, 'utf8')
        };
    }
    return (imageDataFile);
};

const getImage = async (req) => {
    let data = await Image.findAll({
        where: {
            IdLink: req.idLink,
            Type: req.type
        }
    });
    if (data === null)
        return (undefined);
    let dataImage = getDataImage(data);
    if (dataImage === undefined)
        return ("no Data Found");
    return (dataImage);
};

const getAllImage = async (req) => {
    let data = await Image.findAll({
        where: {
            Type: req.type
        }
    });
    if (data === null)
        return (undefined);
    let dataImage = getDataImage(data);
    if (dataImage === undefined)
        return ("no Data Found");
    return (dataImage);
};

exports.getAllImage = getAllImage;
exports.getImage = getImage;
exports.uploadImage = uploadImage;