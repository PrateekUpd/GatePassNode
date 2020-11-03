const mongoose = require('mongoose')
const User = require('./user')
const projectSchema = new mongoose.Schema({
    viewValue: {
        type: String,
        required: true
    },
    gates: [{
        viewValue: {
            type: String
        }
    }]
})

projectSchema.pre('remove', function(next) {
    console.log(this.id)
    User.find({ selectedProject: this.id }, (err, users) => {
        console.log('users',users)
        if (err) {
            next(err)
        } else if (users.length > 0) {
            next(new Error('There are users registered with this project'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Project', projectSchema)