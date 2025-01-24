
function fetchProducts() {
    fetch("https://striveschool-api.herokuapp.com/api/product", {
        method: "GET",
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzkzOTUyYmYyMDE4YzAwMTU5MDc0ZmQiLCJpYXQiOjE3Mzc3MzI4ODMsImV4cCI6MTczODk0MjQ4M30.X3Vkxhbmko1QWAv6YFk4AS6aLD9t8XowHNcDZ3y5-6A"
            }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Errore nella richiesta: " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
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

function createProduct(event) {
    event.preventDefault();

    const newProduct = {
        name: document.getElementById("productName").value,
        description: document.getElementById("productDescription").value,
        brand: document.getElementById("productBrand").value,
        imageUrl: document.getElementById("productImageUrl").value,
        price: document.getElementById("productPrice").value
    };

    fetch("https://striveschool-api.herokuapp.com/api/product", {
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
        fetchProducts(); 
    })
    .catch(error => {
        console.error("Errore nella creazione del prodotto:", error);
    });
}


function updateProduct(productId) {
    const updatedProduct = {
        name: document.getElementById("productName").value,
        description: document.getElementById("productDescription").value,
        brand: document.getElementById("productBrand").value,
        imageUrl: document.getElementById("productImageUrl").value,
        price: document.getElementById("productPrice").value
    };

    fetch(`https://striveschool-api.herokuapp.com/api/product/${productId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedProduct)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Prodotto aggiornato:", data);
        fetchProducts(); 
    })
    .catch(error => {
        console.error("Errore nell'aggiornamento del prodotto:", error);
    });
}

function deleteProduct(productId) {
    fetch(`https://striveschool-api.herokuapp.com/api/product/${productId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
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

document.getElementById("product-form").onsubmit = createProduct;

document.addEventListener("DOMContentLoaded", function() {
    fetchProducts(); 
});
