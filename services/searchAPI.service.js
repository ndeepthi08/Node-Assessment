const request = require('request');

const searchResult = (req) => {
    return new Promise((resolve, reject) => {
        let reqObj = {
            'userId': req.params.userId,
        };
        request({
            uri: `https://api.github.com/users/${reqObj.userId}`,
            method: "GET",
            headers: {
                'User-Agent': reqObj.userId
            }
        }, (err, result) => {
            if (err) {
                console.log("error", err);
                reject("Error connecting to github api. Error is " + err)
            } else {
                console.log("result" + JSON.stringify(result));
                if (result.statusCode === 200) {
                    const response = JSON.parse(result.body);
                    resolve(response)
                } else {
                    reject(result.body)
                }
            }
        })

    })
};

module.exports = {
    searchResult: searchResult
};
