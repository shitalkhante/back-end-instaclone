const mongo = require("mongoose");

const schema = mongo.Schema({
    image: {
        data: Buffer,
        contentType: String
    },
    auther: String,
    location: String,
    description: String,
},
{ timestamps: true }
);

const posts = mongo.model("posts",schema);

module.exports = posts;