import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    ownerEmail: {
        type: String,
        required: true
    },
    published: {
        type: Boolean,
        default: false
    },
    listeners: [{
        type: String
    }],
    listens: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.models.Playlist || mongoose.model('Playlist', PlaylistSchema);