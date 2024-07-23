const express = require('express');
let books = require("./booksdb.js");
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
    if (books){
    return res.send(JSON.stringify(books, null, 4));
  }
  return res.status(300).json({message: "No Books Available"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]){
    return res.send(books[isbn]);
  }
  return res.status(300).json({message: "Book with specific isbn number not available"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = []
    Object.keys(books).forEach( key => {
    if (books[key].author.includes(author)){
        booksByAuthor.push(books[key]);
    }
    });
  if(booksByAuthor) {
    res.send(booksByAuthor);
  }
  else {
    res.send("No Book by the name of this author")
  } 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = []
    Object.keys(books).forEach( key => {
    if (books[key].title.includes(title)){
        booksByTitle.push(books[key]);
    }
    });
  if(booksByTitle) {
    res.send(booksByTitle);
  }
  else {
    res.send("No Book by this title found")
  } 
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
