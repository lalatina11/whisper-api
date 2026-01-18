import app from "./src/app";
import { connectDB } from "./src/config/db";
import ENV from "./src/config/env";

connectDB()
	.then(() => {
		app.listen(ENV.PORT, () => {
			console.log(`Server Up and Running on http://localhost:${ENV.PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
		process.exit(1);
	});
