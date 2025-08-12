import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://arunodyapathum:JB6gvPA3lEur4ISz@cluster0.8l9lube.mongodb.net/Grocery')
    .then(() => console.log('DB CONNECTED'))
}