// Import mongoose
const mongoose = require('mongoose');

// Create schema definition object using mapping notation
const expensesSchemaDefinition = {
    // add each element and its properties
    amount: {
        type: String,
        required: true
    },
    date: {
        type: Date
    },
    category: {
        type: String,
        required: true
    },
    account: {
        type: String,
        default: 'credit'
    }
};

// Create new mongoose schema using the definition object
var expensesSchema = new mongoose.Schema(expensesSchemaDefinition);


// Create new mongoose model using the schema object and
// Import new model > provide name and schema
module.exports = mongoose.model('Expense', expensesSchema);;