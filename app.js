//Importing Require Modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const clarifai = require('clarifai');
const config = require('./config/config');
const request = require('request');
const path = require('path');

const clasrifaiApp = new clarifai.App({
    apiKey: config.key
});

//Initializing express server.
const app = express();

//Port number
const port = process.env.PORT || 3002;

//Cors is used to allow other domains to access our application.
app.use(cors());

//BodyParser is used to parse in coming request body.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Get method is used to fetch the data.
app.get("/getName", (req, res, next) => {
    console.log(req.query.url);
    clasrifaiApp.models.predict("e466caa0619f444ab97497640cefc4dc", req.query.url).then(
        function (response) {
            request("https://kgsearch.googleapis.com/v1/entities:search?query=" + response.rawData.outputs[0].data.regions[0].data.face.identity.concepts[0].name + "&key=AIzaSyA9CvHV75OZgADhnju2DkS73y_3QS1Gsxo&limit=1&indent=True", { json: true }, (error, reaponse, body) => {
                console.log(body.itemListElement);
                res.send(body.itemListElement);
            });

        },
        function (err) {
            // there was an error
        }
    );
});

//Required for navigating angular routes without server routes
app.all('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

//Starting the server.
app.listen(port, () => {
    console.log("ICP10");
});