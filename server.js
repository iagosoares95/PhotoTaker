const express = require('express');
const fs = require('fs');
const request = require('request');
const archiver = require('archiver');
const async = require('async');

const app = express();

var count = 0;
var zip_photos = 'images.zip';
var photos_file = 'images.txt'

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

var savePhotos = function(img) {
    let name = 'photo_';
    let photo_type = '.png';
    count++;
    request(img).pipe(fs.createWriteStream(name.concat(count, photo_type)));
}

async function readImageFile(file) {
    fs.readFile(file, (err, data) => {
        if (err) throw err;
        let photos = JSON.parse(data);

        for (const img of photos.images) {
            savePhotos(img);
        }
    });
}

function compactPhotos(zip_file) {
    var output = fs.createWriteStream(zip_file);
    var archive = archiver('zip');

    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    archive.on('error', function(err) {
        throw err;
    });

    archive.pipe(output);

    archive.glob('*.png');
    archive.finalize();
}

const getPhotoFiles = (req, res) => {
    const fs = require('fs');
    let photo = req.params.filename;
    res.download(photo);
};

async function main() {
    readImageFile(photos_file);
    await sleep(15000);
    compactPhotos(zip_photos);
}

app.get('/', (req, res) => {
    //compactPhotos(zip_photos);
    res.sendFile(__dirname + `/public/html/index.html`);
});

app.get('/download_photo/:filename', getPhotoFiles);

app.get('/get_photos', (req, res) => {
    let files_ = [];
    fs.readdirSync(__dirname).forEach(file => {
        if (file.includes('.zip')) {
            files_.push(file);
        }
    });
    res.send(files_);
});

app.use(express.static(__dirname + '/public'));

app.listen(3000, () => {
    //readImageFile(photos_file);
    main();
    console.log('Listening on localhost:3000');
});