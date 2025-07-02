import mongoose, {Types, ObjectId} from 'mongoose';


const npcSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, enum: ['shopkeeper', 'guard', 'quest_giver', 'tavern_owner', 'generic'], default: 'generic' },
    dialogue: [{
        text: String,
    }],
    inventory: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref:'Item' },
        quantity: { type: Number, default: 1 },
        price: { type: Number }
    }],
    quests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quest' }]});

export default mongoose.model('NPC', npcSchema);