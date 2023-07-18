const express = require('express'),
    app = express();


    const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Server is running on port ${port}!`));
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
