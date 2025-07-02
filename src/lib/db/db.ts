// src/lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

export async function connectDB() {
    if (mongoose.connection.readyState === 1) {
        // כבר מחובר למסד
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: 'RPG',
        });
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}
