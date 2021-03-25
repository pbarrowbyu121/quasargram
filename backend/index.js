/*
    dependencies
*/

const { response } = require('express');
const express = require('express')
const admin = require('firebase-admin');
let inspect = require('util').inspect;
let path = require('path')
let os = require('os')
let fs = require('fs')
let UUID = require('uuid-v4')

let Busboy = require('busboy');

const port = 3000
/* 
    config firebase
*/



const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "quasargram-1391a.appspot.com"
});

let bucket = admin.storage().bucket();
const db = admin.firestore();

/*
    config - express
*/

const app = express()

/* 
    endpoint - posts
*/

app.get('/posts', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    let posts = []
    db.collection('posts').orderBy('date', 'desc').get().then(snapshot => {
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
            posts.push(doc.data())
        }); 
        res.send(posts)
    });
  
})

/* 
    endpoint - create posts
*/

app.post('/createPost', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')

    let uuid = UUID()

    var busboy = new Busboy({ headers: req.headers });

    let fields = {}
    let fileData = {}
    
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        // /tmp/unique id.pn
        let filepath = path.join(os.tmpdir(), filename)
        file.pipe(fs.createWriteStream(filepath))
        fileData = {filepath, mimetype}
    });
    
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    //   console.log('Field [' + fieldname + ']: value: ' + inspect(val));
      fields[fieldname] = val
    });
    
    busboy.on('finish', function() {
        bucket.upload(
            fileData.filepath,
            {
                uploadType: 'media',
                metadata: {
                    metadata: {
                        contentType: fileData.mimetype,
                        firebaseStorageDownloadTokens: uuid
                    }
                }
            },
            (err, uploadedFile) => {
                if (!err) {
                    createDocument(uploadedFile)
                }
            }
        )
        
        function createDocument(uploadedFile) {
            console.log("createDocument called")
             // Add a new document in collection "posts" with ID 'fields.id'
            db.collection('posts').doc(fields.id).set({
            id: fields.id,
            caption: fields.caption,
            location: fields.location,
            date: parseInt(fields.date),
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${ bucket.name}/o/${uploadedFile.name}?alt=media&token=${uuid}`
            }).then(() => {
                res.send("Post added: " + fields.id)
            });
        }
        // res.send('Done parsing form');
      });
    req.pipe(busboy);
})

/* 
    listen 
*/ 
app.listen(process.env.PORT || 5000)
console.log("test")