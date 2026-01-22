class Book {
  #title;
  #author;
  #pages;
  #read;
  #id;

  constructor(title_pass, author_pass, pages_pass, read_pass) {
    this.#title = title_pass;
    this.#author = author_pass;
    this.#pages = pages_pass;
    this.#read = read_pass;
    this.#id = crypto.randomUUID();
  }

  get id() {
    return this.#id;
  }

  set title(title_pass) {
    while (true) {
      console.log(
        `Input was ${title_pass} with a type of ${typeof title_pass}`,
      );
      console.log(typeof title_pass !== "string" || title_pass.length < 1);
      if (typeof title_pass !== "string" || title_pass.length < 1) {
        console.log("if is executed");
        title_pass = prompt("Please enter correct Title-format:");
      } else {
        console.log("else is executed");
        break;
      }
    }
    console.log("this point is reached");
    this.#title = title_pass;
  }

  get title() {
    return this.#title;
  }

  set author(author_pass) {
    while (true) {
      if (typeof author_pass !== "string" || author_pass.length < 1) {
        //
        author_pass = prompt("Please enter correct Author-format:");
      } else {
        break;
      }
    }
    this.#author = author_pass;
  }

  get author() {
    return this.#author;
  }

  set pages(pages_pass) {
    while (true) {
      if (
        typeof pages_pass !== "number" ||
        pages_pass < 1 ||
        isNaN(pages_pass)
      ) {
        pages_pass = Number(prompt("Please enter correct Pages-format:"));
      } else {
        break;
      }
    }
    this.#pages = pages_pass;
  }

  get pages() {
    return this.#pages;
  }

  set read(read_pass) {
    while (true) {
      if (read_pass !== "true" && read_pass !== "false") {
        read_pass = prompt("Please enter correct Read-format:");
      } else {
        break;
      }
    }
    this.#read = read_pass === "true";
  }

  get read() {
    return this.#read;
  }

  getAll() {
    return [this.#id, this.#title, this.#author, this.#pages, this.#read];
  }

  changeRead() {
    this.#read = !this.#read;
    library.updateBook(this.#id, this);
  }
}

const createBookFromInput = function (event) {
  //ALTERNATIVE SEE: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio on data repsentation
  //new:
  //get the value of inputs when closing
  const titleField = document.querySelector('dialog input[name="title"]');
  const authorField = document.querySelector('dialog input[name="author"]');
  const pagesField = document.querySelector('dialog input[name="pages"]');
  const readCheckbox = document.querySelector('dialog input[name="read"]');
  const err = document.querySelector("#error");
  const dialog = document.querySelector("dialog");

  let messages = [];

  if (titleField.value === "" || titleField.value === null) {
    messages.push("Name is required");
  }

  if (authorField.value === "" || authorField.value === null) {
    messages.push("Author is required");
  }

  if (
    typeof Number(pagesField.value) !== "number" ||
    pagesField.value === "" ||
    pagesField.value === null ||
    isNaN(Number(pagesField.value) || Number(pagesField.value) < 0)
  ) {
    messages.push("Invalid page count");
  }

  if (messages.length > 0) {
    event.preventDefault();
    err.innerText = messages.join(", ");
  } else {
    let title = titleField.value;
    let author = authorField.value;
    let pages = Number(pagesField.value);
    let read = readCheckbox.checked;

    library.addBook(new Book(title, author, pages, read));
    library.displayBooks();
    dialog.close();
  }
};

const Library = function () {
  const books = [];

  this.addBook = function (book) {
    books.push(book);
  };

  this.getBooks = function () {
    return books;
  };

  this.updateBook = function (id, bookObject) {
    let read = document.querySelector(`tr[data-book-id = "${id}"] > .read`);
    read.textContent = bookObject.read;
  };

  this.deleteBook = function (bookObject) {
    let index = books.indexOf(bookObject);
    books.splice(index, 1);
  };

  this.displayBooks = function () {
    const bookEntriesId = document.querySelectorAll(".book-entry > th"); // select ID-fields
    const IDs = [];
    bookEntriesId.forEach((entry) => IDs.push(entry.textContent)); //seperate IDs as text into array

    //check if a book has been removed, filter! / select from IDs all books that do not feature in books; remove from display-array all books in library and select the remaining
    const IDsToRemove = [];
    let bookIDs = books.map((book) => book.id);
    let booksRemove = IDs.filter((id) => !bookIDs.includes(id)); // works: has all ids as text of books in display, but not in books in it -> remove all of them
    booksRemove.forEach((entry) =>
      document.querySelector(`.book-entry[data-book-id="${entry}"]`).remove(),
    );

    for (let book of books) {
      if (IDs.includes(book.id)) {
        continue; //check if book is already there
      }

      //create a new row for each book
      let lastRow = document.querySelector("tbody > tr:last-child");
      let nextRow = document.createElement("tr");
      nextRow.classList.toggle("book-entry");
      nextRow.dataset.bookId = book.id;
      lastRow.after(nextRow);

      //create id-cell as row-index
      let nextHeader = document.createElement("th");
      nextHeader.classList.toggle("id");
      nextRow.appendChild(nextHeader);
      nextHeader.innerText = book.id;

      //get all the attributes of a book (title, author, ... )
      let attributes = book.getAll();

      //skip j=0, bc this is already handled above with id-field
      //append a td for title, author, page and read
      for (let j = 1; j < attributes.length; j++) {
        let newCell = document.createElement("td");
        newCell.innerText = attributes[j];
        switch (
          j //make nodes easier to find
        ) {
          case 1:
            newCell.classList.toggle("title");
            break;
          case 2:
            newCell.classList.toggle("author");
            break;
          case 3:
            newCell.classList.toggle("pages");
            break;
          case 4:
            newCell.classList.toggle("read");
            break;
        }
        nextRow.appendChild(newCell);
      }
      //as the last td add a button that allows changing of read-attribute - this bricks the program: overwrites completed with undefined & adds a non functional button

      let changeRead = document.createElement("button");
      changeRead.innerText = "change read";
      changeRead.classList.toggle("change-button");
      let cell = document.createElement("td");
      cell.classList.toggle("css-change-button");
      let cell_div = document.createElement("div");
      cell.append(cell_div);
      cell_div.appendChild(changeRead);

      nextRow.appendChild(cell);

      changeRead.addEventListener("click", () => {
        book.changeRead();
        this.displayBooks();
      }); //books[i] not accessible
      //this is still the button if left alone, to get this on the book-object: use function wrapper in button func argument
      //does not work for non-remove-al version of display function: define a func that updates just the read of this specific entry

      let deleteButton = document.createElement("button");
      deleteButton.innerText = "delete Book";
      deleteButton.classList.toggle("delete-button");
      let anotherCell = document.createElement("td");
      anotherCell.classList.toggle("css-delete-button");
      let anotherCellDiv = document.createElement("div");
      anotherCell.append(anotherCellDiv);
      anotherCellDiv.appendChild(deleteButton);
      nextRow.appendChild(anotherCell);

      deleteButton.addEventListener("click", () => {
        library.deleteBook(book);
        library.displayBooks();
      });
    }
  };
};
const library = new Library();
const newBookButton = document.querySelector(".create-button");
newBookButton.addEventListener("click", () => {
  const dialog = document.querySelector("dialog");
  dialog.showModal();
  document.getElementById("input-form").reset();
});

const dialogClose = document.querySelector("dialog button");
dialogClose.addEventListener("click", createBookFromInput);

const book1 = new Book("Title", "Author", 200, "true");
const book2 = new Book("Ready to Rumble", "McAllen, James", 400, "false");
const book3 = new Book("Ready", "James", 44, "false");
library.addBook(book1);
library.addBook(book2);
library.addBook(book3);
library.displayBooks();
