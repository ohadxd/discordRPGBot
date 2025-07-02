import mongoose from "mongoose";


const locationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    type: {
        type: String,
        enum: ['city', 'dungeon', 'forest', 'lake', 'mountain', 'desert', 'village', 'island'],
        default: 'city'
    },
    image: String, // קישור לתמונה
    buildings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Building' }],
    npcs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NPC' }]
});

export default mongoose.model('Location', locationSchema);
