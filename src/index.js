const express = require("express");
const { useAuthentication } = require("./authentication");
const { generateOGImage } = require("./og-image-generator");
const app = express();
require("dotenv").config();
const axios = require("axios");

const port = process.env.PORT || 3000;

useAuthentication(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use(express.json());

app.post("/og-image.png", async (req, res) => {
  if (!req.body) {
    throw new Error("No request body");
  }
  const { placeholders, svgUrl } = req.body;

  try {
    const { data: svg } = await axios.get(svgUrl);

    const imageBuffer = await generateOGImage(svg, placeholders);
    res.header("Content-Type", "image/png");
    res.header("Content-Length", imageBuffer.length);
    // cache for 48 hours
    res.header("Cache-Control", "public, max-age=172800");
    res.header("Expires", new Date(Date.now() + 172800000).toUTCString());
    res.send(imageBuffer);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
