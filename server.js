const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());  // Per il parsing del corpo della richiesta JSON

// Endpoint per recuperare i prodotti
app.get('/api/product', (req, res) => {
    // Esempio di dati per la risposta
    const products = [
        { id: 1, name: 'Product 1', description: 'Description 1', price: 10 },
        { id: 2, name: 'Product 2', description: 'Description 2', price: 20 }
    ];
    res.json(products);
});

// Endpoint per aggiungere un prodotto
app.post('/api/product', (req, res) => {
    const newProduct = req.body;
    // Simulazione dell'aggiunta del prodotto (salvataggio in DB)
    res.status(201).json(newProduct); // Risposta con il prodotto creato
});

// Endpoint per aggiornare un prodotto
app.put('/api/product/:id', (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    // Simulazione dell'aggiornamento del prodotto
    res.json({ id, ...updatedProduct });
});

// Endpoint per eliminare un prodotto
app.delete('/api/product/:id', (req, res) => {
    const { id } = req.params;
    // Simulazione della cancellazione del prodotto
    res.status(204).end(); // Risposta con stato 204 No Content
});

app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});
