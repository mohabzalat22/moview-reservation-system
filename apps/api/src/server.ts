import "dotenv/config";
import app from "./app";

const port = process.env.port || 4000;

app.listen(port, () => {
  console.log("server running on port: ", port);
});
