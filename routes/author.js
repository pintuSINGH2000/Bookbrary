const express=require('express');
const author = require('../model/author');
const router=express.Router();
const Author=require('../model/author')

//all author
router.get('/',async(req,res)=>{
    let searchOptions = {}
    if(req.query.name != null&& req.query.name !== ''){
        searchOptions.name=new RegExp(req.query.name,'i');
    }
    try{
        const authors=await Author.find(searchOptions)
        res.render('authors/index',{authors:authors,searchOptions : req.query});
    }catch{
       res.redirect('/');
    }
    
});

router.get('/new',(req,res)=>{
    res.render('authors/new',{author:new Author()});
    //res.redirect(`authors/${newAuthor.id}`);
    res.redirect('/authors');
});

router.post('/',async (req,res)=>{
    const author=new Author({
        name:req.body.name
    })
    try{
        const newAuthor =await author.save();
    }catch{
        res.render('authors/new',{
                    author:author,
                    errorMessage:"error Createing Author"
        });
    }

    res.send(req.body.name);
});
module.exports=router