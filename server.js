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

//Função responsável por baixar e salvar o conteúdo das imagens em arquivos enumerados com padrão photo_X.png
var savePhotos = function(img) {
    let name = 'photo_';
    let photo_type = '.png';
    count++;
    request(img).pipe(fs.createWriteStream(name.concat(count, photo_type)));
}

//Função que lê o arquivo onde tem as URLs das fotos
async function readImageFile(file) {
    fs.readFile(file, (err, data) => {
        if (err) throw err;
        let photos = JSON.parse(data);

        for (const img of photos.images) {
            savePhotos(img);
        }
    });
}

//Função responsável por compactar os arquivos .png
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

//Função que dá o conteúdo do arquivo ao frontend para que o usuário faça o download
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
    compactPhotos(zip_photos);
    res.sendFile(__dirname + `/public/html/index.html`);
});

//Função que recebe o nome do arquivo requerido pelo frontend e o direciona para a função que pega seu conteúdo
app.get('/download_photo/:filename', getPhotoFiles);

//Aqui é pego o nome dos arquivos zip para ser entregue ao frontend
app.get('/get_photos', (req, res) => {
    let files_ = [];
    fs.readdirSync(__dirname).forEach(file => {
        if (file.includes('.zip')) {
            files_.push(file);
        }
    });
    res.send(files_);
});

//Função que redireciona ao código do frontend
app.use(express.static(__dirname + '/public'));

app.listen(3000, () => {
    //readImageFile(photos_file);
    main();
    console.log('Listening on localhost:3000');
});