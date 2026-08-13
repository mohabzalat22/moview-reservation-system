import "dotenv/config";
import app from "./app";

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log("server running on port: ", port);
});
