const mongoose = require('mongoose')
const User = require('./user')

const unitSchema = new mongoose.Schema({
    viewValue: {
        type: String,
        required: true
    },
    tolerance: {
        type: Number
    }
})

// unitSchema.pre('remove', function(next) {
//     console.log(this.id)
//     gpArray.find({ selectedDepartment: this.id }, (err, users) => {
//         console.log('users',users)
//         if (err) {
//             next(err)
//         } else if (users.length > 0) {
//             next(new Error('There are users registered with this department'))
//         } else {
//             next()
//         }
//     })
// })

module.exports = mongoose.model('Unit', unitSchema)