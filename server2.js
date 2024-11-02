const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Route to render the payment page
app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'payment.html'));
});

// Route to handle form submission from payment.html
app.post('/submit_payment', (req, res) => {
    // Access the form data from req.body
    const { name, address, paymentMethod } = req.body;

    // (Optional) Save or process payment information here
    console.log(`Name: ${name}, Address: ${address}, Payment Method: ${paymentMethod}`);

    // Redirect to the confirmation page after processing
    res.redirect('/payment_confirmation');
});

// Route to render the payment confirmation page
app.get('/payment_confirmation', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'payment_confirmation.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
});

const db = new sqlite3.Database('./ฐานข้อมูลบริษัทน้ำเปล่า.db');

let query = `CREATE TABLE IF NOT EXISTS Product (
    Product_Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Product_name TEXT,
    Product_Price NUMERIC,
    Stock NUMERIC,
    Product_cost NUMERIC
)`;

db.run(query);

const db2 = new sqlite3.Database('./ฐานข้อมูลบริษัทน้ำเปล่า.db');

let query2 = `CREATE TABLE IF NOT EXISTS Orders (
    Order_Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Customer_Id INT,
    Payment_Id INT,
    Order_Date TEXT,
    Order_Deadline TEXT,
    Order_Month TEXT,
    Order_Year NUMERIC,
    Product_Id INT,
    Order_Count NUMERIC,
    Order_Price NUMERIC,
    Order_Status TEXT
)`;

db2.run(query2);

const db3 = new sqlite3.Database('./ฐานข้อมูลบริษัทน้ำเปล่า.db');

let query3 = `CREATE TABLE IF NOT EXISTS  Customers (
    Customer_Id INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName TEXT,
    LastName TEXT,
    Email TEXT,
    Phone_number NUMERIC,
    Address TEXT
)`;

db3.run(query3);

const db4 = new sqlite3.Database('./ฐานข้อมูลบริษัทน้ำเปล่า.db');

let query4 = `CREATE TABLE IF NOT EXISTS Payment (
    Payment_Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Customer_Id INT,
    Sales_Id INT,
    Total_Price NUMERIC,
    Payment_Date NUMERIC
)`;

db4.run(query4);

const db5 = new sqlite3.Database('./ฐานข้อมูลบริษัทน้ำเปล่า.db');

let query5 = `CREATE TABLE IF NOT EXISTS Sales (
    Sales_Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Product_Id INT,
    Sale_Count NUMERIC,
    Sale_Price NUMERIC,
    Total_Profit NUMERIC
)`;
db5.run(query5);

const db6 = new sqlite3.Database('./ฐานข้อมูลบริษัทน้ำเปล่า.db');

let query6 = `CREATE TABLE IF NOT EXISTS Supply_chain (
    Supply_chain_Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Transport_Id INT,
    Supply_chain_name TEXT,
    Service_fee NUMERIC
)`;
db6.run(query6);

const db7 = new sqlite3.Database('./ฐานข้อมูลบริษัทน้ำเปล่า.db');

let query7 = `CREATE TABLE IF NOT EXISTS Transport (
    Transport_Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Customer_Id INT,
    Product_Id INT,
    Product_route_Id INT,
    Transport_status TEXT
)`;
db7.run(query7);

app.get('/product', (req, res) => {

    let query = 'SELECT * FROM Product';

    db.all(query, (err, rows) => {
        if (err) {
            let msg = {error: err.message};
            status(500).json(msg);
        }
        res.json(rows);
    });
});

app.get('/orders', (req, res) => {

    let query2 = 'SELECT * FROM Orders';

    db.all(query2, (err, rows) => {
        if (err) {
            let msg = {error: err.message};
            status(500).json(msg);
        }
        res.json(rows);
    });
});

app.get('/customers', (req, res) => {

    let query3 = 'SELECT * FROM Customers';

    db.all(query3, (err, rows) => {
        if (err) {
            let msg = {error: err.message};
            status(500).json(msg);
        }
        res.json(rows);
    });
});

app.get('/payment', (req, res) => {

    let query4 = 'SELECT * FROM Payment';

    db.all(query4, (err, rows) => {
        if (err) {
            let msg = {error: err.message};
            status(500).json(msg);
        }
        res.json(rows);
    });
});

app.get('/sales', (req, res) => {

    let query5 = 'SELECT * FROM Sales';

    db.all(query5, (err, rows) => {
        if (err) {
            let msg = {error: err.message};
            status(500).json(msg);
        }
        res.json(rows);
    });
});
app.get('/supply_chain', (req, res) => {

    let query6 = 'SELECT * FROM Supply_chain';

    db.all(query6, (err, rows) => {
        if (err) {
            let msg = {error: err.message};
            status(500).json(msg);
        }
        res.json(rows);
    });
});

app.get('/transport', (req, res) => {

    let query7 = 'SELECT * FROM Transport';

    db.all(query7, (err, rows) => {
        if (err) {
            let msg = {error: err.message};
            status(500).json(msg);
        }
        res.json(rows);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'table.html'))
});

app.get('/search-product', (req, res) => {
    const conditions = [];
    const params = [];
    if (req.query.Product_Id) {
        conditions.push('Product_Id = ?');
        params.push(req.query.Product_Id);
    }
    if (req.query.Product_name) {
        conditions.push('Product_name LIKE ?');
        params.push(`%${req.query.Product_name}%`);
    }
    if (req.query.Product_Price) {
        conditions.push('Product_Price = ?');
        params.push(req.query.Product_Price);
    }
    if (req.query.Stock) {
        conditions.push('Stock = ?');
        params.push(req.query.Stock);
    }
    if (req.query.Product_cost) {
        conditions.push('Product_cost = ?');
        params.push(req.query.Product_cost);
    }
    let query = 'SELECT * FROM Product';
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});
 
app.get('/search-orders', (req, res) => {
    const conditions = [];
    const params = [];
    if (req.query.Order_Id) {
        conditions.push('Order_Id = ?');
        params.push(req.query.Order_Id);
    }
    if (req.query.Customer_Id) {
        conditions.push('Customer_Id = ?');
        params.push(req.query.Customer_Id);
    }
    if (req.query.Payment_Id) {
        conditions.push('Payment_Id = ?');
        params.push(req.query.Payment_Id);
    }
    if (req.query.Order_Date) {
        conditions.push('Order_Date LIKE ?');
        params.push(`%${req.query.Order_Date}%`);
    }
    if (req.query.Order_Deadline) {
        conditions.push('Order_Deadline LIKE ?');
        params.push(`%${req.query.Order_Deadline}%`);
    }
    if (req.query.Order_Month) {
        conditions.push('Order_Month = ?');
        params.push(req.query.Order_Month);
    }
    if (req.query.Order_Year) {
        conditions.push('Order_Year = ?');
        params.push(req.query.Order_Year);
    }
    if (req.query.Product_Id) {
        conditions.push('Product_Id = ?');
        params.push(req.query.Product_Id);
    }
    if (req.query.Order_Count) {
        conditions.push('Order_Count = ?');
        params.push(req.query.Order_Count);
    }
    if (req.query.Order_Price) {
        conditions.push('Order_Price = ?');
        params.push(req.query.Order_Price);
    }
    if (req.query.Order_Status) {
        conditions.push('Order_Status LIKE ?');
        params.push(`%${req.query.Order_Status}%`);
    }
    let query = 'SELECT * FROM Orders';
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});
 
app.get('/search-customers', (req, res) => {
    const conditions = [];
    const params = [];
    if (req.query.Customer_Id) {
        conditions.push('Customer_Id = ?');
        params.push(req.query.Customer_Id);
    }
    if (req.query.FirstName) {
        conditions.push('FirstName LIKE ?');
        params.push(`%${req.query.FirstName}%`);
    }
    if (req.query.LastName) {
        conditions.push('LastName LIKE ?');
        params.push(`%${req.query.LastName}%`);
    }
    if (req.query.Email) {
        conditions.push('Email LIKE ?');
        params.push(`%${req.query.Email}%`);
    }
    if (req.query.Phone_number) {
        conditions.push('Phone_number LIKE ?');
        params.push(`%${req.query.Phone_number}%`);
    }
    if (req.query.Address) {
        conditions.push('Address LIKE ?');
        params.push(`%${req.query.Address}%`);
    }
    let query = 'SELECT * FROM Customers';
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});
 
app.get('/search-payment', (req, res) => {
    const conditions = [];
    const params = [];
    if (req.query.Payment_Id) {
        conditions.push('Payment_Id = ?');
        params.push(req.query.Payment_Id);
    }
    if (req.query.Customer_Id) {
        conditions.push('Customer_Id = ?');
        params.push(req.query.Customer_Id);
    }
    if (req.query.Sales_Id) {
        conditions.push('Sales_Id = ?');
        params.push(req.query.Sales_Id);
    }
    if (req.query.Total_Price) {
        conditions.push('Total_Price = ?');
        params.push(req.query.Total_Price);
    }
    if (req.query.Payment_Date) {
        conditions.push('Payment_Date LIKE ?');
        params.push(`%${req.query.Payment_Date}%`);
    }
    let query = 'SELECT * FROM Payment';
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/search-sales', (req, res) => {
    const conditions = [];
    const params = [];
    if (req.query.Sales_Id) {
        conditions.push('Sales_Id = ?');
        params.push(req.query.Sales_Id);
    }
    if (req.query.Product_Id) {
        conditions.push('Product_Id = ?');
        params.push(req.query.Product_Id);
    }
    if (req.query.Sale_Count) {
        conditions.push('Sale_Count = ?');
        params.push(req.query.Sale_Count);
    }
    if (req.query.Sale_Price) {
        conditions.push('Sale_Price LIKE = ?');
        params.push(req.query.Sale_Price);
    }
     if (req.query.Total_Profit) {
        conditions.push('Total_Profit = ?');
        params.push(req.query.Total_Profit);
    }   
    let query = 'SELECT * FROM Sales';
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});
 

app.get('/search-supply_chain', (req, res) => {
    const conditions = [];
    const params = [];
    if (req.query.Supply_chain_Id) {
        conditions.push('Supply_chain_Id = ?');
        params.push(req.query.Supply_chain_Id);
    }
    if (req.query.Transport_Id) {
        conditions.push('Transport_Id = ?');
        params.push(req.query.Transport_Id);
    }
    if (req.query.Supply_chain_name) {
        conditions.push('Supply_chain_name LIKE = ?');
        params.push(req.query.Supply_chain_name);
    }
    if (req.query.Service_fee) {
        conditions.push('Service_fee = ?');
        params.push(req.query.Service_fee);
    }
    
    let query = 'SELECT * FROM Supply_chain';
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});
 

app.get('/search-transport', (req, res) => {
    const conditions = [];
    const params = [];
    if (req.query.Transport_Id) {
        conditions.push('Transport_Id = ?');
        params.push(req.query.Transport_Id);
    }
    if (req.query.Customer_Id) {
        conditions.push('Customer_Id = ?');
        params.push(req.query.Customer_Id);
    }
    if (req.query.Product_Id) {
        conditions.push('Product_Id = ?');
        params.push(req.query.Product_Id);
    }
    if (req.query.Product_route_Id) {
        conditions.push('Product_route_Id LIKE ?');
        params.push(`%${req.query.Product_route_Id}%`);
    }
    if (req.query.Transport_status) {
        conditions.push('Transport_status LIKE ?');
        params.push(`%${req.query.Transport_status}%`);
    }
    let query = 'SELECT * FROM Transport';
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});
