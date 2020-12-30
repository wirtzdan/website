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

async function getTable(table) {
  const records = await base(table).select({}).all();
  const minifiedRecords = await getMinifiedRecords(records);

  return minifiedRecords;
}

async function getPostBySlug(slug) {
  const records = await base("Blog")
    .select({
      filterByFormula: `TRUE()`,
    })
    .all();
  const minifiedRecords = await getMinifiedRecords(records);
  console.log(
    "🚀 ~ file: airtable.js ~ line 32 ~ getPostBySlug ~ minifiedRecords",
    minifiedRecords
  );

  // .firstPage(function (err, records) {
  //   if (err) {
  //     console.log("🚀 ~ file: airtable.js ~ line 31 ~ err", err);
  //     console.error(err);
  //     return;
  //   }
  //   records.forEach(function (record) {
  //     console.log("🚀 ~ file: airtable.js ~ line 37 ~ record", record);
  //     return record;
  //   });
  // });

  return minifiedRecords;
}

export { getTable, getPostBySlug };
