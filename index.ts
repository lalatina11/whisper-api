import app from "./src/app";
import { connectDB } from "./src/config/db";
import ENV from "./src/config/env";

app.listen(ENV.PORT, () => {
  connectDB();
  console.log(`Server Up and Running on http://localhost:${ENV.PORT}`);
});
