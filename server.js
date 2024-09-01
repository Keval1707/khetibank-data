const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Read JSON data
const dataPath = path.join(__dirname, 'data', 'data.json');
let jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Route for the search form (Home page)
app.get('/', (req, res) => {
    res.render('search', { title: 'Search Candidates' });
});

// Route for handling search requests
app.post('/search', (req, res) => {
    const query = req.body.query.toLowerCase();
    const excludedColumn = "Staff Name";

    const filteredData = jsonData.filter(candidate => {
        return Object.keys(candidate).some(key => {
            if (key === excludedColumn) {
                return false;
            }
            const value = candidate[key];
            return value !== null && value !== undefined && value.toString().toLowerCase().includes(query);
        });
    });

    res.render('search-results', { 
        title: 'Search Results', 
        data: filteredData 
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
