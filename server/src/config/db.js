import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connect = mongoose.connect(process.env.MONGO_URI);
        console.log("COnneected to database ");
    } catch (error ) {
        console.error('failed to connect to databSe' ,error);
        process.exit(1);
    }
}

export default connectDB;