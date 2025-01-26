const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzkzOTUyYmYyMDE4YzAwMTU5MDc0ZmQiLCJpYXQiOjE3Mzc3MzI4ODMsImV4cCI6MTczODk0MjQ4M30.X3Vkxhbmko1QWAv6YFk4AS6aLD9t8XowHNcDZ3y5-6A"; // Token da inserire
console.log("Token:", token);  // Log per verificare che il token sia corretto

// Funzione per recuperare i prodotti dal server e visualizzarli
function fetchProducts() {
    fetch("http://localhost:5000/api/product", {  // URL modificato al server proxy locale
        method: "GET",
        headers: {
            "Authorization": token
        }
    })
    .then(response => {
        console.log("Token inviato:", token);  // Log del token inviato con la richiesta
        if (!response.ok) {
            throw new Error("Errore nella richiesta: " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("Prodotti ricevuti:", data); // Log dei prodotti ricevuti
        const productList = document.getElementById("product-list");
        productList.innerHTML = "";  
        data.forEach(product => {
            const productCard = createProductCard(product);
            productList.appendChild(productCard);  
        });
    })
    .catch(error => {
        console.error("Si è verificato un errore:", error);
    });
}

// Funzione per creare una card di prodotto
function createProductCard(product) {
    const col = document.createElement("div");
    col.classList.add("col-12", "col-md-4");

    const card = document.createElement("div");
    card.classList.add("card", "mb-4");

    const img = document.createElement("img");
    img.classList.add("card-img-top");
    img.src = product.imageUrl;
    img.alt = product.name;

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const h5 = document.createElement("h5");
    h5.classList.add("card-title");
    h5.innerText = product.name;

    const p = document.createElement("p");
    p.classList.add("card-text");
    p.innerText = product.description;

    const price = document.createElement("p");
    price.classList.add("card-text");
    price.innerText = `${product.price} €`;

    const updateBtn = document.createElement("button");
    updateBtn.classList.add("btn", "btn-warning", "me-2");
    updateBtn.innerText = "Modifica";
    updateBtn.onclick = function() {
        fillFormWithProduct(product);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "btn-danger");
    deleteBtn.innerText = "Elimina";
    deleteBtn.onclick = function() {
        deleteProduct(product._id);
    };

    cardBody.appendChild(h5);
    cardBody.appendChild(p);
    cardBody.appendChild(price);
    cardBody.appendChild(updateBtn);
    cardBody.appendChild(deleteBtn);
    card.appendChild(img);
    card.appendChild(cardBody);
    col.appendChild(card);

    return col;
}

// Funzione per pre-compilare il form con i dati del prodotto selezionato
function fillFormWithProduct(product) {
    document.getElementById("productName").value = product.name;
    document.getElementById("productDescription").value = product.description;
    document.getElementById("productBrand").value = product.brand;
    document.getElementById("productImageUrl").value = product.imageUrl;
    document.getElementById("productPrice").value = product.price;

    const form = document.getElementById("product-form");
    form.onsubmit = function(e) {
        e.preventDefault();
        updateProduct(product._id);
    };
}

// Funzione per creare un nuovo prodotto
function createProduct(event) {
    event.preventDefault();  // Impedisce il comportamento di default (invio del form)

    const newProduct = {
        name: document.getElementById("productName").value,
        description: document.getElementById("productDescription").value,
        brand: document.getElementById("productBrand").value,
        imageUrl: document.getElementById("productImageUrl").value,
        price: document.getElementById("productPrice").value
    };

    // Log dei dati del prodotto
    console.log("Dati del prodotto:", newProduct);

    if (newProduct.name && newProduct.description && newProduct.brand && newProduct.imageUrl && newProduct.price) {
        fetch("http://localhost:5000/api/product", {  // URL modificato al server proxy locale
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newProduct)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Prodotto creato:", data);
            fetchProducts();  // Ricarica la lista dei prodotti
            clearForm();      // Pulisce il form dopo l'invio
        })
        .catch(error => {
            console.error("Errore nella creazione del prodotto:", error);
        });
    } else {
        alert("Compila tutti i campi del form.");
    }
}

// Funzione per aggiornare un prodotto esistente
function updateProduct(productId) {
    const updatedProduct = {
        name: document.getElementById("productName").value,
        description: document.getElementById("productDescription").value,
        brand: document.getElementById("productBrand").value,
        imageUrl: document.getElementById("productImageUrl").value,
        price: document.getElementById("productPrice").value
    };

    fetch(`http://localhost:5000/api/product/${productId}`, {  // URL modificato al server proxy locale
        method: "PUT",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedProduct)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Prodotto aggiornato:", data);
        fetchProducts(); 
        clearForm(); // Pulisce il form dopo l'aggiornamento
    })
    .catch(error => {
        console.error("Errore nell'aggiornamento del prodotto:", error);
    });
}

// Funzione per eliminare un prodotto
function deleteProduct(productId) {
    fetch(`http://localhost:5000/api/product/${productId}`, {  // URL modificato al server proxy locale
        method: "DELETE",
        headers: {
            "Authorization": token
        }
    })
    .then(response => {
        if (response.ok) {
            console.log("Prodotto eliminato");
            fetchProducts(); 
        } else {
            console.error("Errore nell'eliminazione del prodotto");
        }
    })
    .catch(error => {
        console.error("Errore nella cancellazione del prodotto:", error);
    });
}

// Funzione per pulire il form
function clearForm() {
    document.getElementById("productName").value = '';
    document.getElementById("productDescription").value = '';
    document.getElementById("productBrand").value = '';
    document.getElementById("productImageUrl").value = '';
    document.getElementById("productPrice").value = '';
}

// Carica i prodotti dal server quando la pagina è pronta
document.addEventListener("DOMContentLoaded", function() {
    fetchProducts(); 
});
