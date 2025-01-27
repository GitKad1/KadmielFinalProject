require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const stateCheck = require("./middleware/checkStates");
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// routes
app.get("/", require("./routes/root"));

app.use("/states/:state/funfact", stateCheck);
app.use("/states/:state/funfact", require("./routes/api/states"));
app.use("/states/:state/capital", stateCheck);
app.use("/states/:state/capital", require("./routes/api/states"));
app.use("/states/:state/nickname", stateCheck);
app.use("/states/:state/nickname", require("./routes/api/states"));
app.use("/states/:state/population", stateCheck);
app.use("/states/:state/population", require("./routes/api/states"));
app.use("/states/:state/admission", stateCheck);
app.use("/states/:state/admission", require("./routes/api/states"));

app.use("/states/:state", stateCheck);
app.use("/states/:state", require("./routes/api/states"));

app.use("/states/", require("./routes/api/states"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
