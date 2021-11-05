const mongoose = require('mongoose')

const panelsSchema = new mongoose.Schema({
    panelData: [{
        title: {
            type: String,
            required: true
        },
        content: {
            type:String,
            required: true
        }
    }],
    project: {
        type:mongoose.Schema.Types.ObjectId,
        required: true
    }
})

panelsSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret.project;
    }
});

module.exports = mongoose.model('Panels', panelsSchema)