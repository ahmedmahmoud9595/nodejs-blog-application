require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const usersRoute = require("./routes/users");
const postsRoute = require("./routes/posts");
const path = require("path");
const groupsRoute = require("./routes/groups");
const authRoute = require("./routes/auth");
// const crypto = require("crypto");
// console.log(crypto.randomBytes(32).toString("hex"));
const errorMiddleware = require("./middleware/error-middlware");
const notFoundMiddleware = require("./middleware/not-found-middlware");
const mongoConnect = require("./config/db-connect");

app.use(express.static(path.join(__dirname, "uploads")));

mongoConnect();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/users", usersRoute);
app.use("/posts", postsRoute);
app.use("/groups", groupsRoute);
app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

// app.listen(process.env.PORT, () => {
//   console.log("Server running on port 5001");
// });

export default app;
