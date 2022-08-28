const express = require('express');
const router = express.Router();
const Author = require('../model/author');
const Book = require('../model/book');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//all books
router.get('/', async (req, res) => {
    let query = Book.find()
    console.log(req.query.title);
    console.log(req.query.publisedAfter);
    console.log(req.query.publisedBefore);
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title,'i'))
    }
    if (req.query.publisedAfter != null && req.query.publisedAfter != '') {
        query = query.gte('publishDate', req.query.publisedAfter)
    }
    if (req.query.publisedBefore != null && req.query.publisedBefore != '') {
        query = query.lte('publishDate', req.query.publisedBefore)
    }
    
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions : req.query
        })
    } catch {
        res.redirect('/');
    }
});

//new books route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());
});

//Create authors route
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author.trim(),
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book,req.body.cover);
    try {
        const newBook = await book.save();
        //res.redirect(`books/$newBook.id`)
        res.redirect('books')
    } catch (error) {
        console.log(error);
        renderNewPage(res, book, true);
    }
});

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = 'Error Creating book'
        res.render('books/new', params);
    } catch {
        res.redirect('/books')
    }
}


function saveCover(book, coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
    }
}
module.exports = router
