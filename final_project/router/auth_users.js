const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    if (userswithsamename.length > 0){
        return false;
    }
    else {
        return true;
    }
}

const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)){
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60*60 });

    req.session.authorization = {
        accessToken, username
    };
    return res.status(200).json({message:"User successfully Logged In"});
  }
  else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  const review = req.query.review;
  let user = req.session.authorization.username;
    book.reviews[user] = review;
    res.send(book);
    if (!review){
        return res.status(404).json({message: "No Review Given to Update"});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    let user = req.session.authorization.username;
    console.log(user);
    console.log(book);
    delete book.reviews[user];
    console.log("Delete Worked");
    console.log(book);
    res.send(`Your review for the book ${book.title} deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
