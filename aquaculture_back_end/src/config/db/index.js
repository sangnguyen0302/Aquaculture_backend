const mongoose = require('mongoose');
const url = 'mongodb+srv://sangnguyen:doandanganh@cluster0.ynwubnn.mongodb.net/aquaculture'
async function connect() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database Connected');
    } catch (error) {
        console.log("Can't connect to database: " + error.message);
    }
}

module.exports = { connect };