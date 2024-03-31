/** Common config for bookstore. */

if (process.env.NODE_ENV === "test") {
  db = `books-test`;
} else {
  db = process.env.DATABASE_URL || `books`;
}


module.exports = { db };