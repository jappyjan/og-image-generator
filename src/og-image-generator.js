const { Resvg } = require("@resvg/resvg-js");

function generateOGImage(svg, placeholders) {
  let content = svg;

  for (const [placeholder, value] of Object.entries(placeholders)) {
    content = content.replace(new RegExp(`{{${placeholder}}}`, "g"), value);
  }

  const resvg = new Resvg(content);
  const pngData = resvg.render();

  const pngBuffer = pngData.asPng();
  return pngBuffer;
}

module.exports = { generateOGImage };