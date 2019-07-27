const models = require("../lib/models");

module.exports = (args, callback) => {
    const Image = models("Image");

    Image.find({}, (err, images) => {
        const mappedImages = {};

        for (const image of images) {
            mappedImages[image.fileName] = image.getOriginalURL();
        }

        console.log(JSON.stringify(mappedImages));
        callback();
    });
};
