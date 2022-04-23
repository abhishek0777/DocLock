const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const mongoose = require("mongoose");

const app = express();

require("./config/passport")(passport);

//Database configuration
const db = require("./config/keys.js").MongoURI;

// check connection to mongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connectd to MongoDB");
  })
  .catch((err) => console.log(err));

  
//template engine (ejs)
app.use(expressLayouts);
app.set("view engine", "ejs");

//for flash messaging
app.use(flash());

//express session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//always initialize passport after sessions
app.use(passport.initialize());
app.use(passport.session());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// set public folder
app.use(express.static(path.join(__dirname, "public")));

//decalre global variables for colors of flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/student", require("./routes/student.js"));
app.use("/admin", require("./routes/admin.js"));

// process.env.PORT, incase i host this website
const PORT = process.env.PORT || 4000;

//listening to port
app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});
