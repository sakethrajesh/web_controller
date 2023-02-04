import mongoose from 'mongoose'

const LampSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
    }  
})

module.exports = mongoose.model('Lamp', LampSchema)