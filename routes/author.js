const express=require('express');
const author = require('../model/author');
const router=express.Router();
const Author=require('../model/author');
const Book=require('../model/book')

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

//new authors route
router.get('/new',(req,res)=>{
    res.render('authors/new',{author:new Author()});
    //res.redirect(`authors/${newAuthor.id}`);
    res.redirect('/authors');
});

//Create authors route
router.post('/',async (req,res)=>{
    const author=new Author({
        name:req.body.name
    })
    try{
        const newAuthor =await author.save();
       res.redirect(`/authors/${newAuthor.id}`);
      //  res.redirect('authors')
    }catch{
        res.render('authors/new',{
                    author:author,
                    errorMessage:"error Createing Author"
        });
    }
})
router.get('/:id',async (req,res) => {
    
  try{
    const author=await Author.findById(req.params.id);
    const books=await Book.find({author :author.id}).limit(6).exec();
    res.render('authors/show',{
    author:author,
    booksbyAuthor : books
  })
  }catch(err){
    res.redirect('/')
  }
});
router.get('/:id/edit',async (req,res) => {
   try{
    const author=await Author.findById(req.params.id);
    res.render('authors/edit',{author:author});
   }catch{
    res.redirect('/authors');
   }
})
router.put('/:id',async (req,res) =>{
     let author
    try{
        author =await Author.findById(req.params.id);
        author.name=req.body.name
        await author.save();
        res.redirect(`/authors/${author.id}`);
    }catch{
        if(author == null){
            res.redirect('/')
        }else{
        res.render('authors/edit',{
                    author:author,
                    errorMessage:"error Updating Author"
        });
    }
    }
})

router.delete('/:id',async (req, res ) => {
    let author
    try{
        author =await Author.findById((req.params.id).trim());
        await author.remove();
        res.redirect(`/authors`);
    }catch(err){
        if(author == null){
            res.redirect('/')
        }else{
        res.redirect(`/authors/${author.id}`);
        }
    }
})
module.exports=router