const mongoose = require('mongoose')

const createFormSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    selectedGate: {
        type:String,
        required: true
    },
    selectedDepartment: {
        type:String,
        required: true
    },
    selectedType: {
        type:String,
        required: true
    },
    selectedOwner: {
        type:String,
        required: true
    },
    selectedMovement: {
        type:String,
        required: true
    },
    receiver: {
        type:String,
        required: true
    },
    firm: {
        type:String,
        required: true
    },
})

module.exports = mongoose.model('CreateForm', createFormSchema)