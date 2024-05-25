const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    albumId: { type: Schema.Types.ObjectId, ref: 'Album', required: true },
    title: { type: String, required: true },
    imageUrl: { type: String, required: true }
});

module.exports = mongoose.model('Photo', PhotoSchema);
