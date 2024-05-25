const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    photos: [
      {
        _id: { type: Schema.Types.ObjectId, ref: 'Photo' }, 
        title: { type: String },
        imageUrl: { type: String }
      }
    ]
  });
  
