const express = require('express');
const fs = require('fs');
const app = express();


var readFiles = function() {
    fs.readFile('images.txt', (err, data) => {
        if (err) throw err;
        let student = JSON.parse(data);

        console.log(student.images[1]);
    });
}

readFiles();

var stream = function() {
    request('https://images-na.ssl-images-amazon.com/images/I/31TsfgL0mzL._AC_SY200_.jpg').pipe(fs.createWriteStream('test1.png'));
}

//stream();