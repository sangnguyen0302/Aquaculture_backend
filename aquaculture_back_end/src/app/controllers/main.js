const method = require('./redux.jsx');
const data = method.getDaydata('temperature');
data.then(data => console.log(data));