const AppController = require("../app/controllers/controller");

function route(app) {
  app.get("/", (req, res) => res.json("Connected"));

  app.post("/register", AppController.createUser);
  app.post("/login", AppController.getUser);
  app.get("/logout", AppController.logOut);

  app.get("/threshold", AppController.getThreshold);
  app.post("/threshold", AppController.setThreshold);
  
  app.get("/notification", AppController.getNotification);
  app.post("/notification", AppController.setNotification);

  app.post('/devices', AppController.getDataDevices)

  app.get('/pump', AppController.getDataPump)
  app.post('/pump', AppController.setDataPump)

  app.get('/oxy', AppController.getDataOxy)
  app.post('/oxy', AppController.setDataOxy)
}

module.exports = route;
