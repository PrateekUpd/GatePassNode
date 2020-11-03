const mongoose = require('mongoose')
const User = require('./user')
const departmentSchema = new mongoose.Schema({
    viewValue: {
        type: String,
        required: true
    },
})

departmentSchema.pre('remove', function(next) {
    console.log(this.id)
    User.find({ selectedDepartment: this.id }, (err, users) => {
        console.log('users',users)
        if (err) {
            next(err)
        } else if (users.length > 0) {
            next(new Error('There are users registered with this department'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Department', departmentSchema)