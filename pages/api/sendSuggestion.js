const Airtable = require("airtable");

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

export default async function handler(req, res) {
  // Parse stringified json
  const body = JSON.parse(req.body);

  return new Promise((resolve, reject) => {
    sendSuggestion(body)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "max-age=180000");
        res.end(JSON.stringify(response));
        resolve();
      })
      .catch((error) => {
        res.json(error);
        res.status(405).end();
        return resolve(); //in case something goes wrong in the catch block (as vijay) commented
      });
  });

  async function sendSuggestion(data) {
    const { title, author, message } = data;
    const table = base("Suggestions");

    return table.create(
      {
        Title: title,
        Author: author,
        Message: message,
      },
      function (err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  }
}
