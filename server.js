const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper function to read data
const getData = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data.json:', error);
        return {};
    }
};

// Helper function to write data
const saveData = (data) => {
    try {
        fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing data.json:', error);
        return false;
    }
};

// Routes
// Home Page
app.get('/', (req, res) => {
    const data = getData();
    res.render('index', { data });
});

// Admin Panel
app.get('/admin', (req, res) => {
    const data = getData();
    res.render('admin', { data });
});

// Admin Update Route
app.post('/admin/update', (req, res) => {
    try {
        const updatedData = req.body;

        // Parse nested JSON strings if needed
        if (typeof updatedData.benefits === 'string') {
            updatedData.benefits = JSON.parse(updatedData.benefits);
        }
        if (typeof updatedData.curriculum === 'string') {
            updatedData.curriculum = JSON.parse(updatedData.curriculum);
        }
        if (typeof updatedData.faq === 'string') {
            updatedData.faq = JSON.parse(updatedData.faq);
        }
        if (typeof updatedData.beforeAfter === 'string') {
            updatedData.beforeAfter = JSON.parse(updatedData.beforeAfter);
        }
        if (typeof updatedData.notifications === 'string') {
            updatedData.notifications = JSON.parse(updatedData.notifications);
        }

        // Merge with existing data
        const currentData = getData();
        const mergedData = { ...currentData, ...updatedData };

        if (saveData(mergedData)) {
            res.json({ success: true, message: 'تم تحديث البيانات بنجاح!' });
        } else {
            res.status(500).json({ success: false, message: 'حدث خطأ أثناء الحفظ' });
        }
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// API to get current data
app.get('/api/data', (req, res) => {
    const data = getData();
    res.json(data);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Arab Motion Academy running at http://localhost:${PORT}`);
    console.log(`📊 Admin Panel at http://localhost:${PORT}/admin`);
});
