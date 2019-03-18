const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");

//config
const keys = require("./config/keys");

//models
require("./models/User");
require("./models/Question");
require("./models/Exam");

const app = express();
const http = require('http').Server(app);
require('./app')(http);

mongoose.connect(keys.mongoURI);

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(require('./middlewares/authenticate'));

//routes
require("./routes/authRoutes")(app);
require("./routes/questionsRoutes")(app);
require("./routes/examsRoutes")(app);

//env
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
http.listen(PORT);
