const mongoose = require('mongoose')
const User = require('./user')
const gradeSchema = new mongoose.Schema({
    viewValue: {
        type: String,
        required: true
    }
})

gradeSchema.pre('remove', function(next) {
    console.log(this.id)
    User.find({ selectedGrade: this.id }, (err, users) => {
        console.log('users',users)
        if (err) {
            next(err)
        } else if (users.length > 0) {
            next(new Error('There are users registered with this grade'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Grade', gradeSchema)