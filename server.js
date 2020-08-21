const express = require('express');
const fs = require('fs');
const request = require('request');
const app = express();

var count = 1;

const getPhotoFiles = (req, res) => {
    const fs = require('fs');
    let photo_dir = 'images/';
    let photo = req.params.filename;
    let final_path = photo_dir.concat(photo);
    res.download(final_path);
};

var savePhotos = function(img) {
    let name = 'images/photo_';
    let photo_type = '.png';

    if (!fs.existsSync('images')) {
        fs.mkdirSync('images');
    }

    request(img).pipe(fs.createWriteStream(name.concat(count, photo_type)));
    count++;
}

var readImageFile = function() {
    fs.readFile('images.txt', (err, data) => {
        if (err) throw err;
        let student = JSON.parse(data);

        for (const img of student.images) {
            savePhotos(img);
        }
    });
}

readImageFile();

app.get('/', (req, res) => {
    res.sendFile(__dirname + `/public/html/index.html`);
});

app.get('/download_photo/:filename', getPhotoFiles);

app.get('/get_photos', (req, res) => {
    let files_ = [];
    var files = fs.readdirSync('images/');
    res.send(files);
});

app.use(express.static(__dirname + '/public'));

app.listen(3000, () => {
    console.log('Listening on localhost:3000');
});