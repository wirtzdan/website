const Airtable = require("airtable");

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

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

async function getBooks() {
  const table = base("Books");
  const records = await table.select({}).all();
  const minifiedRecords = await getMinifiedRecords(records);

  return minifiedRecords;
}

export { getBooks };
