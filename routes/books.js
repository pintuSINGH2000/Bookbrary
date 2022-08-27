const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Author = require('../model/author');
const Book = require('../model/book');
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})
//all books
router.get('/', async (req, res) => {
    let query = Book.find()
  
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
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author.trim(),
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })
    try {
        const newBook = await book.save();
        //res.redirect(`books/$newBook.id`)
        res.redirect('books')
    } catch (error) {
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName);
        }

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

function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.log(err);
    })
}
module.exports = router
