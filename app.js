require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routes/cacheRoutes");

app.use(cors());
app.use(express.json());
app.use("/", routes);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
