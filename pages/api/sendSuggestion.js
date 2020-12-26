const Airtable = require("airtable");

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

export default function handler(req, res) {
  // Parse stringified json
  const body = JSON.parse(req.body);

  sendSuggestion(body)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(405).json(error);
    });

  function sendSuggestion(data) {
    const { title, author, message } = data;
    const table = base("Suggestions");

    return new Promise((resolve, reject) => {
      table.create(
        {
          Title: title,
          Author: author,
          Message: message,
        },
        function (err, record) {
          if (err) {
            reject();
          }
          resolve();
        }
      );
    });
  }
}
