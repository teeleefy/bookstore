//set environment to test
process.env.NODE_ENV = "test";
//npm packages
const request = require('supertest');
//app imports
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

let testBook;

let updatedBook = {
    "isbn": "0691161518",
  "amazon_url": "http://a.co/eobPtX2",
  "author": "Different Author",
  "language": "english",
  "pages": 300,
  "publisher": "Princeton University Press",
  "title": "Different Book",
  "year": 2020
};

let newBook = {
    "isbn": "0697777718",
  "amazon_url": "http://a.co/abcdefg",
  "author": "Cool Author",
  "language": "english",
  "pages": 777,
  "publisher": "A Cool University Press",
  "title": "A Cool Book",
  "year": 2024
};
let bookMissingIsbn = {
  "amazon_url": "http://a.co/abcdefg",
  "author": "Cool Author",
  "language": "english",
  "pages": 777,
  "publisher": "A Cool University Press",
  "title": "A Cool Book",
  "year": 2024
};
let bookMissingAuthor = {
    "isbn": "0697777718",
  "amazon_url": "http://a.co/abcdefg",
  "language": "english",
  "pages": 777,
  "publisher": "A Cool University Press",
  "title": "A Cool Book",
  "year": 2024
};
let bookMissingPages = {
    "isbn": "0697777718",
  "amazon_url": "http://a.co/abcdefg",
  "author": "Cool Author",
  "language": "english",
  "publisher": "A Cool University Press",
  "title": "A Cool Book",
  "year": 2024
};
let bookPagesIsString = {
    "isbn": "0697777718",
  "amazon_url": "http://a.co/abcdefg",
  "author": "Cool Author",
  "language": "english",
  "pages": "this is a string",
  "publisher": "A Cool University Press",
  "title": "A Cool Book",
  "year": 2024
};

beforeEach(async function () {
    await db.query("DELETE FROM books");
    let result = await Book.create({
        isbn: "0691161518",
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        year: 2017
    });
    testBook = result;
})      

/** GET /books - returns `{books: [book, ...]}` */

describe("GET /books", function() {
    test("Gets a list of books", async function() {
      const response = await request(app).get('/books');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        books: [testBook]
      });
    });
  });

// end


/** GET /books/[id] - return data about one book: `{book: book}` */

describe("GET /books/:isbn", function() {
    test("Gets a single book", async function() {
      const response = await request(app).get(`/books/${testBook.isbn}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({book: testBook});
    });

    test("Responds with 404 if can't find book", async function() {
        const response = await request(app).get(`/books/0`);
        expect(response.statusCode).toEqual(404);
      });
  });

// // end


// /** POST /books - create book from data; return `{book: book}` */

describe("POST /books", function() {
  test("Creates a new book", async function() {
    const response = await request(app)
      .post(`/books`)
      .send(newBook);
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      book: newBook
    });
  });

  test("Responds with error creating a new book with missing isbn", async function() {
    const response = await request(app)
      .post(`/books`)
      .send(bookMissingIsbn);
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(expect.objectContaining({error: expect.anything()}));
    });

  test("Responds with error creating a new book with missing author", async function() {
    const response = await request(app)
      .post(`/books`)
      .send(bookMissingAuthor);
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(expect.objectContaining({error: expect.anything()}));
    });

  test("Responds with error creating a new book with missing pages", async function() {
    const response = await request(app)
      .post(`/books`)
      .send(bookMissingPages);
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(expect.objectContaining({error: expect.anything()}));
    });

  test("Responds with error creating a new book with pages sent as incorrect type", async function() {
    const response = await request(app)
      .post(`/books`)
      .send(bookPagesIsString);
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(expect.objectContaining({error: expect.anything()}));
    });

});
// // end


// // /** PATCH /books/[isbn] - update book; return `{book: book}` */

describe("PUT /books/:isbn", function() {
  test("Updates a single book", async function() {
    const response = await request(app).put(`/books/${testBook.isbn}`).send(updatedBook);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      book: updatedBook
    });
  });

  test("Responds with error updating a new book with missing isbn", async function() {
    const response = await request(app)
      .put(`/books/${testBook.isbn}`)
      .send(bookMissingIsbn);
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(expect.objectContaining({error: expect.anything()}));
    });

  test("Responds with error updating a new book with missing author", async function() {
    const response = await request(app)
      .put(`/books/${testBook.isbn}`)
      .send(bookMissingAuthor);
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(expect.objectContaining({error: expect.anything()}));
    });

  test("Responds with error updating a new book with missing pages", async function() {
    const response = await request(app)
      .put(`/books/${testBook.isbn}`)
      .send(bookMissingPages);
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(expect.objectContaining({error: expect.anything()}));
    });

  test("Responds with error updating a new book with pages sent as incorrect type", async function() {
    const response = await request(app)
      .put(`/books/${testBook.isbn}`)
      .send(bookPagesIsString);
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(expect.objectContaining({error: expect.anything()}));
    });

  test("Responds with 404 if can't find book", async function() {
    const response = await request(app).put('/books/0').send(updatedBook);
    expect(response.statusCode).toEqual(404);
  });
});
// // end


// // /** DELETE /books/[isbn] - delete isbn,
// //  *  return `{message: "Book deleted"}` */

describe("DELETE /books/:isbn", function() {
  test("Deletes a single a book", async function() {
    const response = await request(app)
      .delete(`/books/${testBook.isbn}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ message: "Book deleted" });
  });

  test("Responds with 404 if can't find book", async function() {
    const response = await request(app).delete(`/books/0`);
    expect(response.statusCode).toEqual(404);
  });
});
// // end


afterEach(async function() {
  // delete any data created by test
  await db.query("DELETE FROM books");
});

afterAll(async function() {
  // close db connection
  await db.end();
});
