const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // _id: mongoose.Schema.Types.ObjectId,
    empId: {
        type: String,
        // unique: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: true
    },
    selectedProject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    Project: [{
        selectedProject: {
            type: mongoose.Schema.Types.ObjectId,
            // required: true,
            ref: 'Project'
        },
        from: {
            type: Date,
            // required: true,
            default: Date.now
        },
        to: {
            type: Date,
            // required: true,
            default: null
        }
    }],
    selectedGrade: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'Grade'
    },
    Grade: [{
        selectedGrade: {
            type: mongoose.Schema.Types.ObjectId,
            // required: true,
            ref: 'Grade'
        },
        from: {
            type: Date,
            // required: true,
            default: Date.now
        },
        to: {
            type: Date,
            // required: true,
            default: null
        }
    }],
    selectedDepartment: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'Department'
    },
    Department: [{
        selectedDepartment: {
            type: mongoose.Schema.Types.ObjectId,
            // required: true,
            ref: 'Department'
        },
        from: {
            type: Date,
            // required: true,
            default: Date.now
        },
        to: {
            type: Date,
            // required: true,
            default: null
        }
    }],
    selectedAuthorization: {
        type: Boolean,
    },
    selectedCreation: {
        type: Boolean,
    },
    selectedUserType: {
        type: String,
        required: true
    },
    authorizedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        // required: true,
        ref: 'User'
    }]

    // role: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'Role'
    // }
})

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    // transform: function (doc, ret) {
    //     delete ret.Project;
    // }
});

module.exports = mongoose.model('User', userSchema)

// , {
//     collection: 'users'
// }

// Project: [{
//     selectedProject: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'Project'
//     },
//     from: {
//         type: Date,
//         required: true,
//         default: Date.now
//     },
//     to: {
//         type: Date,
//         required: true,
//         default: null
//     }
// }],