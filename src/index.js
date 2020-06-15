// Populate page with quotes with a GET request to http://localhost:3000/quotes?_embed=likes.
// You should not use this query string when creating or deleting a quote.
// The query string in this URL tells json-server to include the likes for a quote in the JSON of the response. 

// API STUFF
const BASE_URL = "http://localhost:3000/"
const LIKES_URL = `${BASE_URL}/likes`
const QUOTES_URL = `${BASE_URL}quotes`
const NEW_QUOTE_URL = `${QUOTES_URL}/new`
const QUOTES_EMBEDED_LIKES_URL = `${QUOTES_URL}?_embed=likes`

// DOM STUFF
const list = document.querySelector("#quote-list");
const form = document.querySelector("#new-quote-form");

document.addEventListener("DOMContentLoaded", () => {

  const getData = url => {
    return fetch(url)
    .then(response => response.json())
  }

  getData(QUOTES_EMBEDED_LIKES_URL)
  .then(quotes => renderQuotes(quotes))
  
  const renderQuotes = quotes => {
    quotes.forEach(quote => renderQuote(quote))
      //something something lets now render a quote with renderQuote
  }
  const renderQuote = quote => {
  
      // find where to append the quote << put in a global variable at top of js file
      // create the html for the quote 
      const li = document.createElement("li")
      li.classList.add("quote-card")
      li.setAttribute("id", `${quote.id}`)
  
  
      const blockquote = document.createElement("blockquote")
      blockquote.classList.add("blockquote")
  
      const p = document.createElement("p")
      p.innerText = quote.quote
      p.classList.add("mb-0")
  
  
      const footer = document.createElement("footer")
      footer.innerText = quote.author
      footer.classList.add("blockquote-footer")
      
      const br = document.createElement("br")
  
      
      const likeButton = document.createElement("button")
      likeButton.innerText = "Likes: "
      likeButton.classList.add("btn-success")
  
  
      const span = document.createElement("span")
      span.innerText = `${quote.likes.length}`
  
  
      const deleteButton = document.createElement("button")
      deleteButton.innerText = "Delete"
      deleteButton.classList.add("btn-danger")

      // const quoteId = quote.id

      // console.log(quoteId)
      
      // console.log(quote)
      deleteButton.addEventListener("click", () => deleteQuote(quote))
  
      // make all the data correct
  
      // append to the thing in the dom
      likeButton.append(span)
      blockquote.append(p, footer, br, likeButton, deleteButton)
      // p and footer (and all other elements) need to exist inside the blockquote tags
      li.append(blockquote)
      list.append(li)
  }

  const postData = (url, data) => {
    const configObject = {
      method: "POST",
      headers: {
        "Accepts": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
    return fetch(url, configObject)
    .then(res => res.json())
  }
  
  const patchData = (url, data) => {
    const configObject = {
      method: "PATCH",
      headers: {
        "Accepts": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
    return fetch(url, configObject)
    .then(res => res.json())
  }

  const deleteData = (url) => {
    const configObject = {
      method: "DELETE"
    }
    return fetch(url, configObject)
    .then(res => res.json())
  }
  
  form.addEventListener("submit", () => {
    event.preventDefault();
    const quote = event.target.quote.value
    const author = event.target.author.value
    
    const formEntry = {quote, author}
    
    // console.log(formEntry)
    postData(QUOTES_URL, formEntry)
    .then(quote => renderQuote({...quote, likes: []}))
    
    
    form.reset()
  })
  
  
  const deleteQuote = (quote) => {
    const li = document.getElementById(`${quote.id}`)
    
    deleteData(`${QUOTES_URL}/${quote.id}`)
    .then(li.remove())
  }
  
  
  
  
  // function renderQuotes(data) {
  
  // }
  
  // const varName = () => {}
  
  // () => {}
})