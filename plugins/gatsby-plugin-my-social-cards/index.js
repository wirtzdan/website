const jimp = require("jimp");
const path = require("path");

module.exports = ({ markdownNode }) => {
  const { frontmatter, fields } = markdownNode;

  const output = path.join("./public", fields.slug, "seo.jpg");

  console.log(output);

  return Promise.all([
    jimp.read(path.join(__dirname, "base.jpg")),
    jimp.loadFont(path.join(__dirname, "fonts/rhd-120/rhd-120.fnt"))
  ]).then(([image, rhd120]) => {
    const WIDTH = 1200;
    const HEIGHT = 630;
    const PADDING = 60;

    image
      .resize(WIDTH, HEIGHT)
      .print(rhd120, PADDING, 40, frontmatter.title, WIDTH - PADDING * 2)
      .write(output);
  });
};
