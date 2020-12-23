const Airtable = require("airtable");

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

export default function handler(req, res) {
  // Parse stringified json
  const body = JSON.parse(req.body);

  return new Promise((resolve, reject) => {
    sendSuggestion(body)
      .then((response) => {
        res.status(200).json(response);
        resolve();
      })
      .catch((error) => {
        res.json(error);
        res.status(405);
        reject;
      });
  });

  function sendSuggestion(data) {
    const { title, author, message } = data;
    const table = base("Suggestions");

    table.create(
      {
        Title: title,
        Author: author,
        Message: message,
      },
      function (err, record) {
        if (err) {
          console.error(err);
          return;
        }
        console.log(record.get("Title"));
      }
    );
  }
}
