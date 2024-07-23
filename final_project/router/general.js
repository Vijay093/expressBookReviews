const express = require('express');
let books = require("./booksdb.js");
const e = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password){
    if(isValid(username)){
        users.push({"username":username, "password":password});
        return res.status(200).json({message:"User Successfully registered, Now You can Login"});
    }
    else{
        return res.status(404).json({message:"User already exists"});
    }
  }
  return res.status(404).json({message: "Unable to register user. Try Again Later"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let promise = new Promise((resolve, reject) => {
        if (books){
            resolve(books);
        }
        else {
            reject("No Books Available");
        }
    });
    promise.then((books) => {
        res.send(JSON.stringify(books, null, 4));
    }).catch((error) => {
        res.status(300).json({message: error});
    });
});

// public_users.get('/', async function (req, res) {
//   try {
//     const booksList = await new Promise((resolve, reject) => {
//       resolve(books);
//     });
//     res.status(200).json(booksList);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching the book list", error });
//   }
// });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
    let promise = new Promise((resolve, reject) => {
        if (books[isbn]){
            resolve(books[isbn]);
        }
        else {
            reject("Book with specific isbn number not available");
        }
    });
    promise.then((book) => {
        res.send(book);
    }).catch((error) => {
        res.status(300).json({message: error});
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let promise = new Promise((resolve, reject) => {
        const author = req.params.author;
        const booksByAuthor = []
          Object.keys(books).forEach( key => {
          if (books[key].author.includes(author)){
              booksByAuthor.push(books[key]);
          }
          });
        if (booksByAuthor) {
            resolve(booksByAuthor);
        }
        else {
            reject("No Book by the name of this author")
        }
    });
    promise.then((books) => {
        res.send(books);
    }).catch((error) => {
        res.send(error);
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let promise = new Promise((resolve, reject) => {
        const title = req.params.title;
        const booksByTitle = []
        Object.keys(books).forEach( key => {
        if (books[key].title.includes(title)){
            booksByTitle.push(books[key]);
        }
        });
        if(booksByTitle) {
            resolve(booksByTitle);
        }
        else {
            reject("No Book Found with this title");
        } 
    });
    promise.then(books => {
        res.send(books);
    }).catch(error => {
        res.send(error);
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]){
    res.send(books[isbn].reviews)
  }
  else {
    res.send("No book with this specific isbn")
  }
});

module.exports.general = public_users;
