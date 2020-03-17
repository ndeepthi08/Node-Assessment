const express = require('express');
const router = express.Router();
const Joi = require('joi');
let validator = require('express-joi-validation')({
    passError: true // NOTE: this tells the module to pass the error along for you
});
const searchService = require('../services/searchAPI.service');
let Schema = {
    'userId': Joi.string().required(),
};

router.get('/users/:userId', validator.params(Schema), (req, res, next) => {
    try {
        searchService.searchResult(req).then(data => {
            console.log("Data", data)
            res.status(200).send({
              UserData: data
            })

        }).catch(err => {
            res.status(500).send({
                Error: err
            })
        });
    } catch (e) {
        res.status(500).send({
            Error: e
        })
    }
});
module.exports = router;
