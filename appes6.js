class Book {
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
// UI Class
class UI {
  addBookToList(book){
    const list = document.getElementById('book-list');
    const row = document.createElement('tr');
    row.innerHTML = `
    <th style="color:aliceblue">${book.title}</th>
    <th style="color:aliceblue">${book.author}</th>
    <th style="color:aliceblue">${book.isbn}</th>
    <th><a href="#" class="delete">X</a></th>
  `
  list.appendChild(row)
  }
  showAlert(massege, className){
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(massege));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div,form);
    document.querySelector('#submit').disabled = true;
    setTimeout(function(){
      document.querySelector('#submit').disabled = false;
    }, 3000);
    setTimeout(function(){
      document.querySelector('.alert').remove()
    }, 3000);
  }
  removeBookFromList(book){
    const list = document.getElementById('book-list');
    list.removeChild(book);
  }
  clearFields(){
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

// Local storage class
class Store {
  static getBooks(){
    let books;
    if(localStorage.getItem('books') === null){
      books = [];
    }else{
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }
  static displayBooks(){
    const books = Store.getBooks();
    books.forEach(function(book){
      const ui = new UI;
      ui.addBookToList(book);
    })
  }
  static addBook(book){
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  static removeBook(isbn){
    const books = Store.getBooks();
    books.forEach(function(book, index){
      if(book.isbn === isbn){
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// DOM load event 
document.addEventListener('DOMContentLoaded', Store.displayBooks());
// Click on Submit
document.getElementById('book-form').addEventListener('submit', function(e){
  // Get values
  const title = document.querySelector('#title').value,
        author = document.querySelector('#author').value,
        isbn = document.querySelector('#isbn').value;
  const book = new Book(title, author, isbn);
  const ui = new UI();
  // Validate input from user
  if(title === '' || author === '' || isbn === ''){
    ui.showAlert('Please Insert Valid input', 'error');
    
  }else{
    // Add a book to UI
    ui.addBookToList(book);
    // add to Local storage
    Store.addBook(book);
    // Show adding successfuly a book to list
    ui.showAlert('Book Added Successfuly to List', 'success');
    // Clear the fields in UI
    ui.clearFields();
  }
  e.preventDefault();
});

// Event Listener for Delete
document.getElementById('book-list').addEventListener('click', function(e){
  const ui = new UI();
  if(e.target.className === 'delete'){
    ui.removeBookFromList(e.target.parentElement.parentElement);
    ui.showAlert('Book Removed!', 'success');
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  }
  e.preventDefault();
});