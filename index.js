const mongos = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8000;
const posts = require("./model");
const cors = require("cors");
const fs = require("fs")
const path = require("path");

mongos.connect("mongodb://127.0.0.1:27017/instaclone").then((msg) => { console.log("db created and connected"); })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//  router.use(bodyParser.)
app.use(cors());

//  router.use("/uploads",express.static("uploads"))
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        // console.log(file);
        cb(null, file.originalname + '-' + Date.now())
    }
});
//   const maxSize=50*1024;
const upload = multer({ storage: storage });

app.get("/", async (req, res) => {
    var data = await posts.find().sort({createdAt:-1});
    res.json({data: data});
});
app.post("/createpost", upload.single('profile'), cors(), async (req, res, next) => {
    try {
        // req.headers({'content-type': ''})
        var obj = await posts.create({
            image: {
                data: fs.readFileSync(path.join('uploads/' + req.file.filename)),
                contentType: 'image/png'
            },
            auther: req.body.author,
            location: req.body.location,
            description: req.body.description
        });
        
        return (
            res.json({ data: obj })
        )
    } catch (error) {
        return res.json({ msg: error });
    }

})

app.listen(port, () => { console.log("server is up"); })