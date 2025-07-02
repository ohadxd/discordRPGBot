import mongoose from 'mongoose';


const questSchema = new mongoose.Schema({
    name: {type: String, required: true},
    dialogue: { type: String },
    items_prize: {type: [mongoose.Schema.Types.ObjectId], ref:'Item', default: []},
    exp: { type: Number, default: 0 },
    gold: { type: Number, default: 0 }
});

export default mongoose.model('Quest', questSchema);
