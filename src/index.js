import { configDotenv } from "dotenv";
configDotenv();
import connectDB from "./db/db.js";
import { app } from "./app.js";
const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`App started listening on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDb connection Failed", err);
  });
