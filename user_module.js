var express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
var DButilsAzure = require('./DButils');
var fs = require('fs');
var parser = require('xml2json');
var body_parser = require('body-parser');
router.use(body_parser.urlencoded({ extended: false }));
router.use(body_parser.json());

var secret = "chenSecret";

router.post('/login', function (req, res) {
    var Username = req.body.Username;
    var Password = req.body.Password;
    var statement = "select * from Users where Username = '" + Username + "' and Password = '" + Password + "'";
    DButilsAzure.execQuery(statement).then(function (result) {
        if (result.length > 0) {
            payload = { Username: Username };
            options = { expiresIn: "3h" };
            const token = jwt.sign(payload, secret, options);
            res.status(200).send({ token: token });
        } else {
            res.status(400).send("Username or Password is incorrect.")
        }
    }).catch(function (result) {
        res.status(400).send(result);
    })
});

router.post('/register', function (req, res) {
    // var countries = [];
    // fs.readFile('C:/Users/User/Documents/חיפוש עבודה/פרויקטים/prague-advisor/Prague-Advisor/server/countries.xml', function (err, data) {
    //     var json = parser.toJson(data);
    //     var splitJson = json.split("\"");
    //     var idx = 0;
    //     for (var i = 11; i <= splitJson.length; i = i + 8) {
    //         countries[idx] = splitJson[i];
    //         idx++;
    //     }
    // });
    var Username = req.body.Username;
    var Password = req.body.Password;
    var statement = "select * from Users where Username = '" + Username + "'";
    DButilsAzure.execQuery(statement).then(function (result) {
        if (result.length == 0) {
            var Country = req.body.Country;
            // if (countries.indexOf(Country) < 0) {
            //     res.status(400).json({ error: "Country is not valid" });
            // } else {
                var Firstname = req.body.Firstname;
                var Lastname = req.body.Lastname;
                var City = req.body.City;
                var Email = req.body.Email;
                var Museums = req.body.Museums;
                var Nature = req.body.Nature;
                var Food = req.body.Food;
                var NightLife = req.body.NightLife;
                var statement2 = "Insert Into Users (Username, Password, FirstName, LastName, City, Country, Email, Museums, Nature, Food, NightLife) Values ('" + Username + "','" + Password + "','" + Firstname + "','" + Lastname + "','" + City + "','" + Country + "','" + Email + "'," + Museums + "," + Nature + "," + Food + "," + NightLife + ")";
                DButilsAzure.execQuery(statement2).then(function (result) {
                    JSON
                    res.status(200).send("Done");
                }).catch(function (result) {
                    res.status(400).send(result);
                })
            // }
        } else {
            res.status(400).json({ error: "Username is taken." });
        }
    }).catch(function (result) {
        res.status(400).send(result);
    })
});

router.post('/password', function (req, res) {
    var Username = req.body.Username;
    var Answer = req.body.Answer;
    var questionIndex = req.body.index;
    var statement = "select * from Users where Username = '" + Username + "'";
    DButilsAzure.execQuery(statement).then(function (result) {
        if (result.length > 0) {
            if (questionIndex == 1 && Answer == result[0].Answer1 ||
                questionIndex == 2 && Answer == result[0].Answer2) {
                res.status(200).json({ result: result[0].Password });
            } else {
                res.status(400).send("Answer is not correct");
            }
        } else {
            res.status(400).send("User does not exist");
        }
    }).catch(function (result) {
        res.status(400).send(result);
    })
});

module.exports = router;