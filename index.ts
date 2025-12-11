import { app } from "./app";
import { env } from "./src/env";

const port = env.PORT;

// Importante aca chequear el error, si no nunca sabes por qué no se levanta el sv
app.listen(port, (err) => {
    if (err) {
        console.log("Error running the server", err);
    } else {
        console.log(`Server is running on port ${port}`);
    }
});
