import "./configs/env.js";
// import connect_db from "./configs/db.js";
import app from "./server.js";

// connect_db();
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Listening");
});
