document.addEventListener('DOMContentLoaded', () => {

getAllQuotes();

})

const quoteList = document.getElementById('quote-list');
const form = document.getElementById('new-quote-form');
const URL = 'http://localhost:3000/quotes?_embed=likes';
const menuButton = document.createElement('button');
const divMenu = document.getElementById('menu');
menuButton.innerText = "Sort by Author: OFF";
divMenu.insertBefore(menuButton, quoteList);


menuButton.addEventListener('click', () => sortByAuthor())

function createEditForm() {
    const editForm = document.createElement('form');
    editForm.innerHTML = `
    <div class="form-group">
      <label for="new-quote">Edit Quote</label>
      <input name="quote" type="text" class="form-control" id="edit-quote" placeholder="Learn. Love. Code.">
    </div>
    <div>
      <label for="Author">Author</label>
      <input name="author" type="text" class="form-control" id="author" placeholder="Flatiron School">
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>`;

    editForm.id = "edit-quote-form";
    editForm.style.display="none";

    return editForm
}

function createQuoteLi(quote) {
    const li = document.createElement('li');
    li.classList.add('quote-card');
    li.id = quote.id;

    const block = document.createElement('blockquote');
    block.classList.add('blockquote');

    const p = document.createElement('p');
    p.classList.add('mb-0');
    p.innerText = quote.quote;

    const footer = document.createElement('footer');
    footer.classList.add("blockquote-footer");
    footer.innerText = quote.author;

    const br = document.createElement('br');

    const likesButton = document.createElement('button');
    likesButton.classList.add(`btn-success`);
    likesButton.innerText = "Likes: ";
    const spanLike = document.createElement('span');

    if (quote.likes) {
        spanLike.innerText = quote.likes.length;
        likesButton.append(spanLike);
    }

    const deleteButton = document.createElement('button');
    deleteButton.classList.add(`btn-danger`);
    deleteButton.innerText = "Delete";

    const editButton = document.createElement('button');
    editButton.classList.add('edit');
    editButton.innerText = "Edit";
    const editForm = createEditForm();
 

    block.append(p, footer, br, likesButton, deleteButton, editButton, editForm);
    li.append(block);

    deleteButton.addEventListener('click', () => deleteQuote(quote, li));
    likesButton.addEventListener('click', () => likeQuote(quote, spanLike));
    editButton.addEventListener('click', () => editQuote(quote, editForm));
    return li
}

function renderQuote(quote) {
    const li = createQuoteLi(quote);
    quoteList.append(li);
}

function renderAllQuotes(quotesArray) {
    quotesArray.forEach(quote => renderQuote(quote));
}

function getAllQuotes() {
    quoteList.innerHTML = "";
    fetch(URL)
      .then(res => res.json())
      .then(quotesArray => renderAllQuotes(quotesArray));
}

form.addEventListener('submit', e => addNewQuote(e))

function addNewQuote(e) {
    e.preventDefault();
    let object = {
    quote: e.target[0].value,
    author: e.target[1].value,
    likes: []
    };
    let configObject = {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    },
    body: JSON.stringify(object)
    };
    fetch(`http://localhost:3000/quotes/`, configObject)
    .then(resp => resp.json())
    .then(data => {
        const firstLi = quoteList.firstElementChild; 
        const li = createQuoteLi(data)
        quoteList.insertBefore(li, firstLi);
        })
    .catch(error => console.log(error));
    form.reset();
}

function deleteQuote(quote, li) {
   let object = {
   id: quote.id
   };
   let configObject = {
   method: 'DELETE',
   headers: {
   'Content-Type': 'application/json',
   'Accept': 'application/json'
   },
   body: JSON.stringify(object)
   };
   fetch(`http://localhost:3000/quotes/${quote.id}`, configObject)
   .then(resp => resp.json())
   .then(li.remove())
   .catch(error => console.log(error));
}

function likeQuote(quote, spanLike) {
    let object = {
    quoteId: quote.id,
    createdAt: new Date
    };
    let configObject = {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    },
    body: JSON.stringify(object)
    };
    fetch(`http://localhost:3000/likes/`, configObject)
    .then(resp => resp.json())
    .then(getAllQuotes())
    .catch(error => console.log(error));
}

function editQuote(quote, editForm) {
    editForm.style.display = "block";
    editForm.quote.value = quote.quote;
    editForm.author.value = quote.author;
    
    editForm.addEventListener('submit', e => updateQuote(e, quote))
}
function updateQuote(e, quote){
    e.preventDefault();
    let object = {
    quote: e.target[0].value,
    author: e.target[1].value
    };
    let configObject = {
    method: 'PATCH',
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    },
    body: JSON.stringify(object)
    };
    fetch(`http://localhost:3000/quotes/${quote.id}`, configObject)
    .then(resp => resp.json())
    .then(getAllQuotes)
    .catch(error => console.log(error));
}

function sortByAuthor() {
    if (menuButton.innerText === "Sort by Author: OFF") {
        menuButton.innerText = "Sort by Author: ON";
        quoteList.innerHTML = "";
        fetch(`http://localhost:3000/quotes?_sort=author`)
          .then(res => res.json())
          .then(quotesArray => renderAllQuotes(quotesArray));
    } else {
        menuButton.innerText = "Sort by Author: OFF"
        getAllQuotes();
    }
}