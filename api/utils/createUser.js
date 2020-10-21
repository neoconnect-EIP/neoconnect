const   db = require("../_helpers/db"),
        bcrypt = require("bcrypt"),
        Inf = db.Influencer,
        Shop = db.Shop,
        { TEST_PSEUDO, TEST_PASSWORD, TEST_EMAIL } = process.env,
        jwtUtils = require("../utils/jwt.utils"),
        validation = require("../utils/validation"),
        utils = require("../utils/themeSelection");

async function takeHighId() {
    const valueInf = await Inf.max('id');
    const valueShop = await Shop.max('id');

    if (isNaN(valueInf)) {
        if (isNaN(valueShop))
            return (0);
        return (valueShop)
    }
    if (isNaN(valueShop))
        return (valueInf);
    if (isNaN(valueInf))
        return (valueShop);
    if (valueInf < valueShop)
        return (valueShop);
    return (valueInf);
}


module.exports = {
    registerTestAccounts: async function () {
        if ((await Inf.findOne({where: {pseudo: `${TEST_PSEUDO}Inf`}})) ||
            (await Shop.findOne({where: {pseudo: `${TEST_PSEUDO}Shop`}}))) {
            return ("Users already create");
        }


        const idMax = await takeHighId();

        let hash = bcrypt.hashSync(TEST_PASSWORD, 5);
        const inf = await Inf.create({
            id: idMax + 1,
            pseudo: TEST_PSEUDO + "Inf",
            password: hash,
            userType: "influencer",
            email: TEST_EMAIL,
            visitNumber: 0
        });
        const shop = await Shop.create({
            id: idMax + 2,
            pseudo: TEST_PSEUDO + "Shop",
            password: hash,
            userType: "shop",
            email: TEST_EMAIL,
            visitNumber: 0
        });
        return ("Users created");
    }
};