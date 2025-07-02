import mongoose from 'mongoose';


const questSchema = new mongoose.Schema({
    name: {type: String, required: true},
    dialouge: { type: String },
    items_prize: {type: [mongoose.Schema.Types.ObjectId], ref:'Item', default: []},
});

export default mongoose.model('Quest', questSchema);
