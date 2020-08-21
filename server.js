const express = require('express');
const fs = require('fs');
const request = require('request');
const app = express();

var count = 1;

var stream = function(img) {
    let name = 'images/photo_';
    let photo_type = '.png';

    if (!fs.existsSync('images')) {
        fs.mkdirSync('images');
    }

    request(img).pipe(fs.createWriteStream(name.concat(count, photo_type)));
    count++;
}
const app = express();


var readFiles = function() {
    fs.readFile('images.txt', (err, data) => {
        if (err) throw err;
        let student = JSON.parse(data);

        for (const img of student.images) {
            stream(img);
        }
    });
}

readFiles();