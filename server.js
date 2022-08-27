if(process.env.NODE_ENV !=='production'){
    require('dotenv').config();
}
const express=require('express');
const ejs=require('ejs');
const expressLayouts=require('express-ejs-layouts');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const app=express();
const indexrouter=require('./routes/index');
const authorRouter=require('./routes/author');
const bookRouter=require('./routes/books')

app.set('view engine','ejs');
app.set('views',__dirname+'/views');
app.set('layout','layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({limit:'10mb',extended: false}));

mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true
});
const db=mongoose.connection;
db.on('error', error => console.error(error));
db.once('open',() => console.log('connection to moongose'));

app.use('/',indexrouter);
app.use('/authors',authorRouter);
app.use('/books',bookRouter);



app.listen(process.env.PORT || 3000,(req,res)=>{
    console.log("server is running");
});