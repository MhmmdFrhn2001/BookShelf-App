document.addEventListener('DOMContentLoaded', function () {
    const bookForm = document.getElementById('book-form');
    const searchInput = document.getElementById('search');
    const unfinishedBooksList = document.getElementById('unfinished-books');
    const finishedBooksList = document.getElementById('finished-books');

    bookForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const year = document.getElementById('year').value;
        addBook(title, author, year, false);
        bookForm.reset();
    });

    searchInput.addEventListener('input', function () {
        renderBooks();
    });

    function addBook(title, author, year, isFinished) {
        const book = { title, author, year, isFinished };
        const books = getBooksFromStorage();
        books.push(book);
        saveBooksToStorage(books);
        renderBooks();
    }

    function getBooksFromStorage() {
        return JSON.parse(localStorage.getItem('books')) || [];
    }

    function saveBooksToStorage(books) {
        localStorage.setItem('books', JSON.stringify(books));
    }

    function renderBooks() {
        const books = getBooksFromStorage();
        const searchText = searchInput.value.toLowerCase();
        unfinishedBooksList.innerHTML = '';
        finishedBooksList.innerHTML = '';
        books.forEach((book, index) => {
            if (book.title.toLowerCase().includes(searchText) || book.author.toLowerCase().includes(searchText) || book.year.toString().includes(searchText)) {
                const bookElement = document.createElement('li');
                bookElement.textContent = `${book.title} oleh ${book.author} (${book.year})`;
                const markFinishedButton = document.createElement('button');
                markFinishedButton.textContent = book.isFinished ? 'Belum Selesai Dibaca' : 'Selesai Dibaca';
                markFinishedButton.classList.add('mark-finished');
                markFinishedButton.addEventListener('click', function () {
                    book.isFinished = !book.isFinished;
                    saveBooksToStorage(books);
                    renderBooks();
                });
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Hapus';
                deleteButton.classList.add('delete');
                deleteButton.addEventListener('click', function () {
                    if (confirm(`Apakah kamu ingin menghapus buku dengan judul "${book.title}"?`)) {
                        books.splice(index, 1);
                        saveBooksToStorage(books);
                        renderBooks();
                    }
                });
                bookElement.appendChild(markFinishedButton);
                bookElement.appendChild(deleteButton);
                if (book.isFinished) {
                    finishedBooksList.appendChild(bookElement);
                } else {
                    unfinishedBooksList.appendChild(bookElement);
                }
            }
        });
    }

    renderBooks();
});