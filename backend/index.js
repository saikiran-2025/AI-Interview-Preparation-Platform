require("dotenv").config();
let mongoose = require("mongoose");
let express = require("express");
let cors = require("cors");
let path = require("path");
let rt = require("./routers/routes");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("db connected"))
  .catch((err) => console.log("db error", err));

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", rt);

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});