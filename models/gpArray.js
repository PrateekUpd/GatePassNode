const mongoose = require('mongoose')
const CreateForm = require('./createForm')
const GatePass = require('./gatePass')

const gpArraySchema = new mongoose.Schema({
    gatePassNo: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    authorized: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    authorizedDate: {
        type: Date,
    },
    exitDate: {
        type: 'Date',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        default: 'Created'
    },
    createForm: {
        name: {
            type: String,
            required: true
        },
        selectedGate: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Project.gates'
        },
        selectedDepartment: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Department'
        },
        selectedProject: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Project'
        },
        selectedType: {
            type: String,
            required: true
        },
        selectedOwner: {
            type: String,
            required: true
        },
        selectedMovement: {
            type: String,
            required: true
        },
        receiver: {
            type: String,
            required: true
        },
        firm: {
            type: String,
            required: true
        },
        vendorName: {
            type: String
        }
    },
    gatePass: [{
        sno: {
            type: Number,
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
        quantityRet: {
            type: Number,
        },
        // quantityRet: [{
        //     amount: {
        //         type: Number
        //     },
        //     retDate: {
        //         type: Date
        //     }
        // }],
        unit: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Unit'
        },
        issuedTo: {
            type: String,
            required: true
        },
        dateOfReturn: {
            type: Date,
            // required: true
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
            // required: true
        }
    }]
})

module.exports = mongoose.model('GpArray', gpArraySchema)