import mongoose from 'mongoose';

const npcSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, enum: ['shopkeeper', 'guard', 'quest_giver', 'tavern_owner', 'generic'], default: 'generic' },
    dialogue: [{
        text: String,
        condition: String // optional future condition (e.g. quest not completed)
    }],
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
    inventory: [{
        itemId: { type: String },
        quantity: { type: Number, default: 1 },
        price: { type: Number }
    }],
    quests: [{city: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest' }}]
});

export default mongoose.model('NPC', npcSchema);