require("rootpath")();
const swaggerDocument =  require('./swagger.json');
const swaggerUi =  require('swagger-ui-express');
const express = require("express"),
        bodyParser = require("body-parser"),
        cors = require("cors"),
        app = express(),
        db = require("./_helpers/db"),
        port = process.env.PORT || 8080 ;


//create and check db is create
db.sequelize.sync({force: true}).then(() => {
    console.log("DB Created");
});

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//Create router
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", require("./Shop/shop.controller"));
app.use("/", require("./Influencer/influencer.controller"));
app.use("/", require("./Offers/offres.controller"));

//Start server
app.listen(port, function() {
    console.log(`Running on port ${port}`);
});