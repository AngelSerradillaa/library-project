"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _a;
//Decorador para el debug
function decoratorDebug(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`Ejecutando el método "${propertyKey}" con argumentos: ${args.map(arg => JSON.stringify(arg)).join(', ')}`);
        return originalMethod.apply(this, args);
    };
    return descriptor;
}
class Book {
    constructor(title, author, year, genre, copiesAvailable) {
        this.title = title;
        this.author = author;
        this.year = year;
        this.genre = genre;
        this.copiesAvailable = copiesAvailable;
    }
    borrowBook() {
        if (this.copiesAvailable > 0) {
            this.copiesAvailable--;
            return true;
        }
        return false;
    }
    returnBook() {
        this.copiesAvailable++;
    }
    getCopiesAvailable() {
        return this.copiesAvailable;
    }
}
class User {
    constructor(name, email, birthDate) {
        this.name = name;
        this.email = email;
        this.birthDate = birthDate;
        this.borrowedBooks = new Map();
    }
    borrowBook(book) {
        if (book.borrowBook()) {
            console.log(book.title);
            this.borrowedBooks.set(book.title, new Date());
            return true;
        }
        return false;
    }
    returnBook(book) {
        if (this.borrowedBooks.has(book.title)) {
            book.returnBook();
            this.borrowedBooks.delete(book.title);
        }
    }
    hasBorrowed(book) {
        console.log(this.borrowedBooks);
        return this.borrowedBooks.has(book.title);
    }
}
__decorate([
    decoratorDebug
], User.prototype, "borrowBook", null);
__decorate([
    decoratorDebug
], User.prototype, "returnBook", null);
class Library {
    constructor() {
        this.books = [];
        this.users = [];
        this.currentUser = null;
    }
    addBook(book) {
        const exists = this.books.some(b => b.title.toLowerCase() === book.title.toLowerCase() && b.author.toLowerCase() === book.author.toLowerCase());
        if (exists) {
            alert(`El libro "${book.title}" de "${book.author}" ya existe.`);
            return `El libro "${book.title}" de "${book.author}" ya existe.`;
        }
        this.books.push(book);
        return `El libro "${book.title}" de "${book.author}" ha sido añadido.`;
    }
    removeBook(title, author) {
        this.books = this.books.filter(book => !(book.title.toLowerCase() === title.toLowerCase() && book.author.toLowerCase() === author.toLowerCase()));
    }
    findBook(title, author) {
        return this.books.find(book => book.title.toLowerCase() === title.toLowerCase() && book.author.toLowerCase() === author.toLowerCase());
    }
    addUser(user) {
        this.users.push(user);
    }
    findUser(email) {
        return this.users.find(user => user.email === email);
    }
    loginUser(email) {
        const user = this.findUser(email);
        if (user) {
            this.currentUser = user;
            return `El usuario "${user.name}" se logueado correctamente.`;
        }
        return `El usuario con el "${email}" no ha sido encontrado.`;
    }
    logoutUser() {
        if (this.currentUser) {
            const name = this.currentUser.name;
            this.currentUser = null;
            return `El usuario "${name}" se ha deslogueado correctamente.`;
        }
        return `No hay usuario logueado.`;
    }
    deleteUser() {
        if (this.currentUser) {
            const userToDelete = this.currentUser;
            this.users = this.users.filter(user => user.email !== userToDelete.email);
            this.currentUser = null;
            return `El usuario "${userToDelete.name}" ha sido eliminado.`;
        }
        return `No hay usuario logueado que eliminar.`;
    }
    getCurrentUser() {
        return this.currentUser;
    }
    borrowBookByDetails(title, author) {
        if (!this.currentUser) {
            return `Debes estar registrado para coger libros.`;
        }
        const book = this.findBook(title, author);
        if (book && this.currentUser.borrowBook(book)) {
            return `El libro "${title}" de "${author}" se ha tomado prestado.`;
        }
        return `El libro "${title}" de "${author}" no está disponible.`;
    }
    returnBookByDetails(title, author) {
        if (!this.currentUser) {
            return `Debes estar logueado para devolver libros.`;
        }
        const book = this.findBook(title, author);
        if (book && this.currentUser.hasBorrowed(book)) {
            this.currentUser.returnBook(book);
            return `El libro "${title}" de "${author}" ha sido devuelto.`;
        }
        return `No has tomado prestado "${title}" de "${author}".`;
    }
}
__decorate([
    decoratorDebug
], Library.prototype, "addBook", null);
__decorate([
    decoratorDebug
], Library.prototype, "removeBook", null);
__decorate([
    decoratorDebug
], Library.prototype, "findBook", null);
__decorate([
    decoratorDebug
], Library.prototype, "addUser", null);
__decorate([
    decoratorDebug
], Library.prototype, "findUser", null);
__decorate([
    decoratorDebug
], Library.prototype, "loginUser", null);
__decorate([
    decoratorDebug
], Library.prototype, "logoutUser", null);
__decorate([
    decoratorDebug
], Library.prototype, "deleteUser", null);
__decorate([
    decoratorDebug
], Library.prototype, "getCurrentUser", null);
__decorate([
    decoratorDebug
], Library.prototype, "borrowBookByDetails", null);
__decorate([
    decoratorDebug
], Library.prototype, "returnBookByDetails", null);
// DOM Manipulation for Adding, Removing, and Searching Books
const library = new Library();
// Elements
const bookForm = document.getElementById('book-form');
const userForm = document.getElementById('user-form');
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');
const searchTitleInput = document.getElementById('search-title');
const searchAuthorInput = document.getElementById('search-author');
const searchButton = document.getElementById('search-button');
const booksList = document.getElementById('books-list');
const statusDisplay = document.getElementById('status-display');
const statusDiv = document.getElementById('status-div');
statusDiv.style.display = "none";
const loginDiv = document.getElementById('login-div');
// Add User
userForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const birthDate = new Date(document.getElementById('user-birthdate').value);
    const user = new User(name, email, birthDate);
    library.addUser(user);
    alert(`Usuario "${name}" añadido correctamente.`);
    userForm.reset();
});
// Login User
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const message = library.loginUser(email);
    alert(message);
    updateBooksList();
    updateStatusDisplay();
    loginForm.reset();
});
// Logout User
logoutButton.addEventListener('click', () => {
    const message = library.logoutUser();
    alert(message);
    updateBooksList();
    updateStatusDisplay();
});
// Delete User
const deleteUserButton = document.createElement('button');
deleteUserButton.textContent = 'Eliminar Usuario';
deleteUserButton.addEventListener('click', () => {
    const message = library.deleteUser();
    alert(message);
    updateBooksList();
    updateStatusDisplay();
});
(_a = statusDisplay.parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(deleteUserButton);
// Add Book
bookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const year = parseInt(document.getElementById('book-year').value, 10);
    const genre = document.getElementById('book-genre').value;
    const copies = parseInt(document.getElementById('book-copies').value, 10);
    const book = new Book(title, author, year, genre, copies);
    library.addBook(book);
    updateBooksList();
    bookForm.reset();
});
// Remove Book
booksList.addEventListener('click', (event) => {
    const target = event.target;
    if (target && target.classList.contains('remove-book')) {
        const title = target.dataset.title;
        const author = target.dataset.author;
        library.removeBook(title, author);
        updateBooksList();
    }
});
// Return Book
booksList.addEventListener('click', (event) => {
    const target = event.target;
    if (target && target.classList.contains('return-book')) {
        const title = target.dataset.title;
        const author = target.dataset.author;
        const message = library.returnBookByDetails(title, author);
        alert(message);
        updateBooksList();
    }
});
// Search Book
searchButton.addEventListener('click', () => {
    const title = searchTitleInput.value.toLowerCase();
    const author = searchAuthorInput.value.toLowerCase();
    const book = library.findBook(title, author);
    if (book) {
        alert(`Libro encontrado: ${book.title} de ${book.author}`);
    }
    else {
        alert('No se han encontrado libros con ese título y autor');
    }
});
// Borrow Book
booksList.addEventListener('click', (event) => {
    const target = event.target;
    if (target && target.classList.contains('borrow-book')) {
        const title = target.dataset.title;
        const author = target.dataset.author;
        const message = library.borrowBookByDetails(title, author);
        alert(message);
        updateBooksList();
    }
});
// Update Status Display
function updateStatusDisplay() {
    const currentUser = library.getCurrentUser();
    if (currentUser) {
        statusDisplay.textContent = `Logueado como: ${currentUser.name}`;
        statusDiv.style.display = "flex";
        loginDiv.style.display = "none";
    }
    else {
        statusDiv.style.display = "none";
        loginDiv.style.display = "block";
    }
}
// Update Books List
function updateBooksList() {
    booksList.innerHTML = '';
    const currentUser = library.getCurrentUser();
    library.books.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `${book.title} de ${book.author} (${book.getCopiesAvailable()} copias disponibles)`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Eliminar';
        removeButton.classList.add('remove-book');
        removeButton.dataset.title = book.title;
        removeButton.dataset.author = book.author;
        li.appendChild(removeButton);
        if (currentUser) {
            if (currentUser.hasBorrowed(book)) {
                const returnButton = document.createElement('button');
                returnButton.textContent = 'Devolver';
                returnButton.classList.add('return-book');
                returnButton.dataset.title = book.title;
                returnButton.dataset.author = book.author;
                li.appendChild(returnButton);
            }
            else {
                const borrowButton = document.createElement('button');
                borrowButton.textContent = 'Coger';
                borrowButton.classList.add('borrow-book');
                borrowButton.dataset.title = book.title;
                borrowButton.dataset.author = book.author;
                li.appendChild(borrowButton);
            }
        }
        booksList.appendChild(li);
    });
}
let book1 = new Book("El camino de los reyes", "Brandon Sanderson", 2010, "Fantasía", 168);
library.addBook(book1);
book1 = new Book("Asesinato en el Orient Express", "Agatha Christie", 1934, "Misterio", 64);
library.addBook(book1);
book1 = new Book("Romeo Y Julieta", "William Shakespeare", 1597, "Tragedia", 23);
library.addBook(book1);
book1 = new Book("El nombre del viento", "Patrick Rothfuss", 2007, "Fantasía", 72);
library.addBook(book1);
book1 = new Book("El problema de los tres cuerpos", "Liu Cixin", 2006, "Ciencia Ficción", 0);
library.addBook(book1);
updateBooksList();
