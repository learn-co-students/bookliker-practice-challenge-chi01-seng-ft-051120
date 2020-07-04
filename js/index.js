const URL = "http://localhost:3000/books"

document.addEventListener("DOMContentLoaded", function() {
    fetchBooks(URL);
    document.addEventListener("click", handleEvents)
});

function fetchBooks(url) {
    fetch(url)
    .then(resp => resp.json())
    .then(books => renderBooks(books))
}

function renderBooks(books) {
    books.forEach(book => {
        renderBook(book)
    })
}

function renderBook(book) {
    const list = document.getElementById("list-panel")
    list.innerHTML += `<li class=title data-book-id=${book.id}>${book.title}</li>`
    const show = document.getElementById("show-panel")
    let usersString = `<ul id="book ${book.id} users" style="list-style-type:none">Users Who Liked this Book:`
    book.users.forEach(user => {
        usersString += `<li>${user.username}</li>`}
    )
    usersString +=  `</ul>`
    show.innerHTML += `<div class="book-card" id="${book.id}" style="display:none">
    <img src="${book.img_url}" alt="${book.title}">
    <p>${book.description}</p>
    ${usersString}
    <button class="like">Like</button></div>`
}

function handleEvents(event) {
    if (event.target.className === "title") {
        displayBookInfo(event)
    } else if (event.target.className === "like") {
        event.target.className = "unlike"
        event.target.innerHTML = `Unlike`
        getLikeData(event)
    } else if (event.target.className === "unlike") {
        event.target.className = "like"
        event.target.innerHTML = `Like`
        removeLikeData(event)
    }
}

function displayBookInfo(event) {
    const bookCards = document.getElementsByClassName("book-card")
        for (let i=0; i<bookCards.length; i++) {
            bookCards[i].style.display = "none"
        }
        const idToFind = event.target.dataset.bookId
        const card = document.getElementById(`${idToFind}`)
        card.style.display = "block"
}

function getLikeData(event) {
    const bookId = event.target.parentNode.id
    const bookUrl = URL + '/' + bookId
    return fetch(bookUrl)
    .then(resp => resp.json())
    .then(json => addLike(json, bookId, bookUrl))
}

function addLike(json, bookId, bookUrl) {
    let usersArray = json.users
    const newUserObject = {"id":1, "username":"pouros"}
    usersArray.push(newUserObject)
    let usersObj = {"users": usersArray}
    const reqObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usersObj)
    }
    fetch(bookUrl, reqObj)
    .then(resp => resp.json())

    const usersList = document.getElementById(`book ${bookId} users`)
    usersList.innerHTML = `Users Who Liked this Book:`
    let usersString = ""
    usersArray.forEach(user => {
        usersString += `<li>${user.username}</li>`}
    )
    usersList.innerHTML += usersString
}

function removeLikeData(event) {
    const bookId = event.target.parentNode.id
    const bookUrl = URL + '/' + bookId
    return fetch(bookUrl)
    .then(resp => resp.json())
    .then(json => unLike(json, bookId, bookUrl))
}

function unLike(json, bookId, bookUrl) {
    let usersArray = json.users
    usersArray.pop()
    let usersObj = {"users": usersArray}
    const reqObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usersObj)
    }
    fetch(bookUrl, reqObj)
    .then(resp => resp.json())

    const usersList = document.getElementById(`book ${bookId} users`)
    usersList.innerHTML = `Users Who Liked this Book:`
    let usersString = ""
    usersArray.forEach(user => {
        usersString += `<li>${user.username}</li>`}
    )
    usersList.innerHTML += usersString
}