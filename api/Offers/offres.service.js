const   jwt = require("jsonwebtoken"),
		db = require("../_helpers/db"),
		bcrypt = require("bcrypt"),
        User = db.Offre,
        config = require("../config");

module.exports = {
	insert,
	getAll,
	getById,
	update,
	delete: _delete
};

async function getAll() {
	return await User.findAll();
}

async function getById(id) {
	return await User.findById(id);
}

async function insert(userParam) {
	User.create({_id: userParam._id,
		productImg: userParam.productImg,
		productName: userParam.productName,
		productSex: userParam.productSex,
		productDesc: userParam.productDesc,
		productSubject: userParam.productSubject});
/*	const product = new Offres({
		_id: userParam._id,
		productImg: userParam.productImg,
		productName: userParam.productName,
		productSex: userParam.productSex,
		productDesc: userParam.productDesc,
		productSubject: userParam.productSubject
	});
	await product.save();*/
}

async function update(id, userParam) {
	const product = await User.findById(id);
	if (!product) throw "Product not found";
	Object.assign(product, userParam);
	await product.save();
}

async function _delete(id) {
	await User.findByIdAndRemove(id);
}