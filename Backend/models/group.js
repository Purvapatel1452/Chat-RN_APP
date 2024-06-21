// Group Schema
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroupExpense'
    }],

    description: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    image:{
        type:String,
        default:"https://cdn.sanity.io/images/kts928pd/production/d4f96a14f70da85a81bbfa8eeb05c054439dfef5-731x731.png"
        
    },
    // Add more attributes as needed
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;

