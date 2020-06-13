document.addEventListener('DOMContentLoaded', () => {
// ----------------------------------------------------------------------------------------
// Consts 
// ----------------------------------------------------------------------------------------

const ul = document.getElementById('quote-list');
const orderButton = document.createElement('button');
orderButton.innerText = "Order Alphabetically";
const idButton = document.createElement('button');
idButton.innerText = "Order Chronologically"
ul.append(orderButton)

// ----------------------------------------------------------------------------------------
// Fetch all the quotes 
// ----------------------------------------------------------------------------------------
const getQuotes = () => {
fetch('http://localhost:3000/quotes?_embed=likes')
.then(resp => resp.json())
.then(quotes => renderQuotes(quotes))
.catch(error => console.log(error.message));
}

const renderQuotes = (quotes) => {
    quotes.forEach(quote => {
        renderQuote(quote)
    });
}

const renderQuote = (quote) => {
    const li = document.createElement('li');
    li.className = "quote-card";

    const blockquote = document.createElement('blockquote');
    blockquote.className = "blockquote";

    const p =document.createElement('p');
    p.className = "mb-0";
    p.innerText = quote.quote

    const footer = document.createElement('footer');
    footer.className = "blockquote-footer";
    footer.innerText = quote.author;

    const br = document.createElement('br');

    const likeButton = document.createElement('button');
    likeButton.className = 'btn-success';
    likeButton.innerHTML = `Likes: <span>${quote.likes.length}</span>`;
    likeButton.addEventListener('click', e => {
        like(quote);
        likeButton.innerHTML = `Likes: <span>${quote.likes.length += 1}</span>`;
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn-danger';
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener('click', e => {
        e.preventDefault();
        deleteQuote(quote);
        e.target.parentNode.parentNode.remove()
    });

    blockquote.append(p, footer, br, likeButton, deleteButton);
    li.append(blockquote);
    ul.append(li)
}

// ----------------------------------------------------------------------------------------
// Add a quote  
// ----------------------------------------------------------------------------------------

const form = document.querySelector('#new-quote-form');
form.addEventListener('submit', e => {
        e.preventDefault();

        const object = {
            quote: form[0].value,
            author: form[1].value,
            likes: []
        };

        const configObject = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
        },
        body: JSON.stringify(object)
        };

        fetch('http://localhost:3000/quotes', configObject)
        .then(resp => resp.json())
        .then(quote => renderQuote(quote))

    });

// ----------------------------------------------------------------------------------------
// Delete a quote 
// ----------------------------------------------------------------------------------------
const deleteQuote = (quote) => {
    
const configObject = {
method: 'DELETE',
headers: {
'Content-Type': 'application/json',
Accept: 'application/json'
},
body: JSON.stringify({
    id: quote.id,
    quote: quote.quote,
    author: quote.author
})
};

fetch(`http://localhost:3000/quotes/${quote.id}`, configObject)
}

// ----------------------------------------------------------------------------------------
// Add a quote  
// ----------------------------------------------------------------------------------------

const like = (quote) => {
const object = {
quoteId: quote.id,
created_at: Date.now()
};

const configObject = {
method: 'POST',
headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
},
body: JSON.stringify(object)
};

fetch('http://localhost:3000/likes', configObject)
.then(resp => resp.json());
}

// ----------------------------------------------------------------------------------------
// Toggle an alphabet button  
// ----------------------------------------------------------------------------------------

orderButton.addEventListener('click', e => {
    e.preventDefault();
    fetch('http://localhost:3000/quotes?_sort=author')
    .then(resp => resp.json())
    .then(quotes => renderQuotesAlphabetically(quotes))
    // .catch(error => console.log(error.message));
});

const renderQuotesAlphabetically = (quotes) => {
    const oldQuotes = document.querySelectorAll(".quote-card")
    oldQuotes.forEach(oldQuote => oldQuote.remove())
    quotes.forEach(quote => {
        renderQuoteAlphabetically(quote)
    });
}

const renderQuoteAlphabetically = (quote) => {
    const li = document.createElement('li');
    li.className = "quote-card";

    const blockquote = document.createElement('blockquote');
    blockquote.className = "blockquote";

    const p =document.createElement('p');
    p.className = "mb-0";
    p.innerText = quote.quote

    const footer = document.createElement('footer');
    footer.className = "blockquote-footer";
    footer.innerText = quote.author;

    const br = document.createElement('br');

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn-danger';
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener('click', e => {
        e.preventDefault();
        deleteQuote(quote);
        e.target.parentNode.parentNode.remove()
    });

    blockquote.append(p, footer, br, deleteButton);
    li.append(blockquote);
    ul.append(li)
}

getQuotes()
})