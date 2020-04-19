const   db = require("../_helpers/db"),
        fs = require('fs'),
        bcrypt = require("bcrypt"),
        User = db.Influencer,
        Offer = db.Offre,
        Shop = db.Shop,
        Image = db.Image,
        { URL } = process.env,
        jwtUtils = require("../utils/jwt.utils");

folderImage = (data) => {
    if (!fs.existsSync(__dirname + '/../image')) {
        fs.mkdirSync(__dirname + '/../image');
    }
    for (let i = 0; i !== data.image.length; i++) {
        let base64String = `data:image/png;base64,${data.image[i].imageData}`;
        let base64Image = base64String.split(';base64,').pop();
        fs.writeFileSync(`${__dirname}/../image/${data.type}_${data.idLink}_${data.image[i].imageName}.png`, base64Image, {encoding: 'base64'});
    }
};

const uploadImage = async (req) => {
    if (req.image === undefined)
        return (undefined);
    let dataId = [];
    const tmp = req;
    for (let i = 0; i !== tmp.image.length; i++) {
        let data = await Image.create({
            ImageName: tmp.image[i].imageName,
            Type: req.type,
            IdLink: req.idLink
        });
        dataId.push(data.id);
    }
    if (req.type === 'Offer') {
        let Current = await Offer.findOne({
            where: {id: req.idLink}
        });
        Current.productImg = dataId;
        Current.save().then(() => {});
    }
    else {
        let Current = await User.findOne({
            where: {id: req.idLink}
        });
        if (Current === null) {
            Current = await Shop.findOne({
                where: {id: req.idLink}
            });
        }
        Current.userPicture = dataId;
        Current.save().then(() => {});
    }
    folderImage(req);
    return (req);
};

getDataImage = (data) => {
    let imageDataFile = [];
    for (let i = 0; i < data.length; i++) {
        if (!fs.existsSync(`${__dirname}/../image/${data[i].dataValues.Type}_${data[i].dataValues.IdLink}_${data[i].dataValues.ImageName}.png`)) {
            continue;
        }
        imageDataFile[i] = {
            idLink: data[i].dataValues.IdLink,
            imageName: data[i].dataValues.ImageName,
            imageData: `${URL}/image/${data[i].dataValues.Type}_${data[i].dataValues.IdLink}_${data[i].dataValues.ImageName}.png`
        };
    }
    return (imageDataFile);
};

deleteImage = (data) => {

    for (let i = 0; i !== data.length; i++) {
        fs.unlinkSync(`${__dirname}/../image/${data[i].Type}_${data[i].IdLink}_${data[i].ImageName}.png`);
    }
};

editImage = async (req) => {
    let data = await Image.findAll({
        where: {
            IdLink: req.idLink,
            Type: req.type
        }
    });
    console.log(data.image);
    if (data !== null) {
        await deleteImage(data);
        await Image.destroy({
            where: {
                IdLink: req.idLink,
                Type: req.type
            }
        })
    }
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

const regroupImageData = async (allData, type) => {
    if (type === 'Offer') {
        for (let i = 0; i < allData.length; i++) {
            if (allData[i].productImg === null)
                continue;
            allData[i].productImg = await getImage({'idLink': allData[i].id.toString(), 'type': type})
        }
    }
    else {
        for (let i = 0; i < allData.length; i++) {
            if (allData[i].userPicture === null)
                continue;
            allData[i].userPicture = await getImage({'idLink': allData[i].id.toString(), 'type': type})
        }
    }
    return (allData);
};

exports.getAllImage = getAllImage;
exports.getImage = getImage;
exports.uploadImage = uploadImage;
exports.regroupImageData = regroupImageData;
exports.editImage = editImage;