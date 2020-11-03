const mongoose = require('mongoose')

const gatePassSchema = new mongoose.Schema({
    sno: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    modeOfTransport: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    issuedTo: {
        type: String,
        required: true
    },
    dateOfReturn: {
        type: Date,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    remark: {
        type: String,
        required: true
    },
    incomingRef: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('GatePass', gatePassSchema)