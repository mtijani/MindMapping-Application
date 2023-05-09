// This file will handle connection to the mongodb database
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/MiniProjet', {useNewUrlParser:true, useUnifiedTopology: true},).then(()=>{
    console.log('Connected to mongoDB Successfuly ');

}).catch((e)=>{
    console.log('Error with attempting to connect to MongoDB');
    console.log(e);
});  
//To prevent deprecation warnings (from mongodb native driver)

module.exports = {
    mongoose
};