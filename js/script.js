let utenti = fetch("utenti.json").then(resolve => resolve.json());
let prodotti = fetch("prodotti.json").then(resolve => resolve.json());
let carrello = []
function hideNshow() {
    document.querySelector('#cards').style.display = "block";
    document.querySelector('#form').style.display = "none";
    document.querySelectorAll('.hidden').forEach(ele => { ele.classList.remove("hidden") });
}
function printCards() {
    prodotti.then(prodotti => {
        localStorage.setItem('prodotti', JSON.stringify(prodotti));
        prodotti.forEach(prodotto => {
            let div = document.createElement('div');
            div.classList.add('col');
            div.innerHTML = `
                            <div class="card h-100">
                            <img src="${prodotto.url}" class="card-img-top" alt="immagine macchina">
                            <div class="card-body">
                            <h5 class="card-title">${prodotto.modello}</h5>
                            <h6 class="card-title">${prodotto.marca}</h6>
                            <p class="card-text">${prodotto.dettagli}</p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                            <button type="button" id="addProduct" class="btn btn-success" onClick="AddToCart(${prodotto.id})">Add to cart</button>
                            <span class="prezzo">${prodotto.prezzo}€</span>
                                </div>
                                </div>`
            document.querySelector('#carta').append(div)
        })
    })
}
function AddToCart(id) {
    let veicoli = localStorage.getItem('prodotti');
    veicoli = JSON.parse(veicoli);
    let veicoloTrovato = veicoli.find(veicolo => veicolo.id == id);
    carrello.push(veicoloTrovato)
    localStorage.setItem('carrello', JSON.stringify(carrello))
}
function printCart() {
    document.querySelector('tbody').innerHTML = ""
    let carrello = localStorage.getItem('carrello');
    carrello = JSON.parse(carrello);
    carrello.forEach((prod, index) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `<th scope="row">${index + 1}</th>
        <td>${prod.modello}</td>
        <td>${prod.id}</td>
        <td>${prod.prezzo}€</td>
        <td><button type="button" class="btn btn-danger" onClick="Delete(${prod.id})">Delete</button></td>`
        document.querySelector('tbody').append(tr);
    })
}
function Delete(id) {
    let carrello = localStorage.getItem('carrello');
    carrello = JSON.parse(carrello);
    carrello = carrello.filter(prod => prod.id != id)
    localStorage.setItem('carrello', JSON.stringify(carrello))
    printCart()
}

document.addEventListener("DOMContentLoaded", function () {
    let utenteLoggato = localStorage.getItem("utenteLoggato")

    if (document.location.pathname === "/index.html") {
        console.log("index")
        document.querySelector('#cart').addEventListener("click", function (event) {
            if (!utenteLoggato) {
                event.preventDefault();
                alert('Please login into an account')
            }
        })
        if (utenteLoggato == null) {
            document.querySelector('#cards').style.display = "none";
            document.querySelector('#login-btn').addEventListener("click", function () {
                let email = document.querySelector('#email').value;
                let password = document.querySelector('#password').value;
                utenti.then(utenti => {
                    utenteLoggato = utenti.find(utente => utente.email === email && utente.password === password)
                    console.log(utenteLoggato)
                    if (utenteLoggato) {
                        localStorage.setItem("utenteLoggato", JSON.stringify(utenteLoggato))
                        hideNshow()
                        printCards()
                    } else {
                        alert('Email o password non validi')
                    }
                })
            })
        }
        else {
            hideNshow()
            printCards()
            document.querySelector('#logout').addEventListener("click", function () {
                localStorage.removeItem("utenteLoggato");
                localStorage.removeItem('carrello');
            })
        }

    }
    else if (document.location.pathname === "/carrello.html") {
        console.log("carrello")
        printCart()
        document.querySelector('#logout').addEventListener("click", function () {
            localStorage.removeItem("utenteLoggato");
            localStorage.removeItem('carrello');
            location.reload()
        })
    }

})