const Airtable = require("airtable");

// Airtable.configure({
//   endpointUrl: "https://api.airtable.com",
//   apiKey: process.env.AIRTABLE_API_KEY,
// });
// var base = Airtable.base(process.env.AIRTABLE_BASE_ID);

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
var base = Airtable.base(process.env.AIRTABLE_BASE_ID);

// maps over the records, calling minifyRecord, giving us required data
const getMinifiedRecords = (records) => {
  return records.map((record) => minifyRecord(record));
};

// gets the data we want and puts it into variables
const minifyRecord = (record) => {
  return {
    id: record.id,
    fields: record.fields,
  };
};

export async function getBooks() {
  const table = base("Books");
  const records = await table.select({}).all();
  const minifiedRecords = await getMinifiedRecords(records);

  return minifiedRecords;
}

export async function sendSuggestion(data) {
  const table = base("Suggestions");

  table.create(
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
