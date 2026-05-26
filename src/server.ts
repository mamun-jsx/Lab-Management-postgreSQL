import app from "./app";
import config from "./config";

async function main() {
  try {
    app.listen(config.port, () => {
      console.log(
        `Example app listening on http://localhost:${process.env.PORT}`,
      );
    });
  } catch (err) {
    console.log(err);
  }
}
main();