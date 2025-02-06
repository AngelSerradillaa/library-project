

// src/models/Book.ts
interface IBook {
    title: string;
    author: string;
    year: number;
    genre: string;
    copiesAvailable: number;
}

class Book implements IBook {
    constructor(
        public title: string,
        public author: string,
        public year: number,
        public genre: string,
        public copiesAvailable: number
    ) {}

    public borrowBook(): boolean {
        if (this.copiesAvailable > 0) {
            this.copiesAvailable--;
            return true;
        }
        return false;
    }

    public returnBook(): void {
        this.copiesAvailable++;
    }

    public getCopiesAvailable(): number {
        return this.copiesAvailable;
    }
}

interface IUser {
    name: string;
    email: string;
    birthDate: Date;
}

class User implements IUser {
    private borrowedBooks: Map<string, Date> = new Map();

    constructor(
        public name: string,
        public email: string,
        public birthDate: Date
    ) {}

    public borrowBook(book: Book): boolean {
        if (book.borrowBook()) {
            console.log(book.title);
            this.borrowedBooks.set(book.title, new Date());
            return true;
        }
        return false;
    }

    public returnBook(book: Book): void {
        if (this.borrowedBooks.has(book.title)) {
            book.returnBook();
            this.borrowedBooks.delete(book.title);
        }
    }
    public hasBorrowed(book: Book): boolean {
        console.log(this.borrowedBooks);
        return this.borrowedBooks.has(book.title);
    }
}


class Library {
    public books: Book[] = [];
    public users: User[] = [];
    public currentUser: User | null = null;

    public addBook(book: Book): string {
        const exists = this.books.some(
            b => b.title.toLowerCase() === book.title.toLowerCase() && b.author.toLowerCase() === book.author.toLowerCase()
        );
        if (exists) {
            alert(`El libro "${book.title}" de "${book.author}" ya existe.`) 
            return `El libro "${book.title}" de "${book.author}" ya existe.`;
        }
        this.books.push(book);
        return `El libro "${book.title}" de "${book.author}" ha sido añadido.`;
    }

    public removeBook(title: string, author: string): void {
        this.books = this.books.filter(
            book => !(book.title.toLowerCase() === title.toLowerCase() && book.author.toLowerCase() === author.toLowerCase())
        );
    }

    public findBook(title: string, author: string): Book | undefined {
        return this.books.find(
            book => book.title.toLowerCase() === title.toLowerCase() && book.author.toLowerCase() === author.toLowerCase()
        );
    }

    public addUser(user: User): void {
        this.users.push(user);
    }

    public findUser(email: string): User | undefined {
        return this.users.find(user => user.email === email);
    }

    public loginUser(email: string): string {
        const user = this.findUser(email);
        if (user) {
            this.currentUser = user;
            return `El usuario "${user.name}" se logueado correctamente.`;
        }
        return `El usuario con el "${email}" no ha sido encontrado.`;
    }

    public logoutUser(): string {
        if (this.currentUser) {
            const name = this.currentUser.name;
            this.currentUser = null;
            return `El usuario "${name}" se ha deslogueado correctamente.`;
        }
        return `No hay usuario logueado.`;
    }

    public deleteUser(): string {
        if (this.currentUser) {
            const userToDelete = this.currentUser;
            this.users = this.users.filter(user => user.email !== userToDelete.email);
            this.currentUser = null;
            return `El usuario "${userToDelete.name}" ha sido eliminado.`;
        }
        return `No hay usuario logueado que eliminar.`;
    }

    public getCurrentUser(): User | null {
        return this.currentUser;
    }

    public borrowBookByDetails(title: string, author: string): string {
        if (!this.currentUser) {
            return `Debes estar registrado para coger libros.`;
        }
        const book = this.findBook(title, author);
        if (book && this.currentUser.borrowBook(book)) {
            return `El libro "${title}" de "${author}" se ha tomado prestado.`;
        }
        return `El libro "${title}" de "${author}" no está disponible.`;
    }

    public returnBookByDetails(title: string, author: string): string {
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

// DOM Manipulation for Adding, Removing, and Searching Books
const library = new Library();

// Elements
const bookForm = document.getElementById('book-form') as HTMLFormElement;
const userForm = document.getElementById('user-form') as HTMLFormElement;
const loginForm = document.getElementById('login-form') as HTMLFormElement;
const logoutButton = document.getElementById('logout-button') as HTMLButtonElement;
const searchTitleInput = document.getElementById('search-title') as HTMLInputElement;
const searchAuthorInput = document.getElementById('search-author') as HTMLInputElement;
const searchButton = document.getElementById('search-button') as HTMLButtonElement;
const booksList = document.getElementById('books-list') as HTMLUListElement;
const statusDisplay = document.getElementById('status-display') as HTMLParagraphElement;
const statusDiv = document.getElementById('status-div') as HTMLParagraphElement;
statusDiv.style.display = "none";
const loginDiv = document.getElementById('login-div') as HTMLParagraphElement;

// Add User
userForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = (document.getElementById('user-name') as HTMLInputElement).value;
    const email = (document.getElementById('user-email') as HTMLInputElement).value;
    const birthDate = new Date((document.getElementById('user-birthdate') as HTMLInputElement).value);

    const user = new User(name, email, birthDate);
    library.addUser(user);
    alert(`Usuario "${name}" añadido correctamente.`);
    userForm.reset();
});

// Login User
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = (document.getElementById('login-email') as HTMLInputElement).value;
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
statusDisplay.parentElement?.appendChild(deleteUserButton);

// Add Book
bookForm.addEventListener('submit', (event) => {
    console.log("Se ha ejecutado el addBook");
    event.preventDefault();
    const title = (document.getElementById('book-title') as HTMLInputElement).value;
    const author = (document.getElementById('book-author') as HTMLInputElement).value;
    const year = parseInt((document.getElementById('book-year') as HTMLInputElement).value, 10);
    const genre = (document.getElementById('book-genre') as HTMLInputElement).value;
    const copies = parseInt((document.getElementById('book-copies') as HTMLInputElement).value, 10);

    const book = new Book(title, author, year, genre, copies);
    console.log("Se ha añadido:", book);
    library.addBook(book);
    console.log(library);

    updateBooksList();
    bookForm.reset();
});

// Remove Book
booksList.addEventListener('click', (event) => {
    const target = event.target as HTMLButtonElement;
    if (target && target.classList.contains('remove-book')) {
        const title = target.dataset.title as string;
        const author = target.dataset.author as string;
        library.removeBook(title, author);
        updateBooksList();
    }
});

// Return Book
booksList.addEventListener('click', (event) => {
    const target = event.target as HTMLButtonElement;
    if (target && target.classList.contains('return-book')) {
        const title = target.dataset.title as string;
        const author = target.dataset.author as string;
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
    } else {
        alert('No se han encontrado libros con ese título y autor');
    }
});

// Borrow Book
booksList.addEventListener('click', (event) => {
    const target = event.target as HTMLButtonElement;
    if (target && target.classList.contains('borrow-book')) {
        const title = target.dataset.title as string;
        const author = target.dataset.author as string;
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
    } else {
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
                console.log("Hay libro prestado")
                returnButton.textContent = 'Devolver';
                returnButton.classList.add('return-book');
                returnButton.dataset.title = book.title;
                returnButton.dataset.author = book.author;
                li.appendChild(returnButton);
            } else {
                const borrowButton = document.createElement('button');
                console.log("No hay libro prestado")
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


