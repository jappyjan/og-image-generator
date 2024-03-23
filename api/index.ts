const express = require("express");
const { useAuthentication } = require("./authentication");
const { generateOGImage } = require("./og-image-generator");
const app = express();
require("dotenv").config();
const axios = require("axios");

const port = 3000;

useAuthentication(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use(express.json());

app.get("/og-image.png", async (req, res) => {
  // take placeholders and svgUrl from query params
  const { svgUrl, ...placeholders } = req.query;

  if (!svgUrl) {
    return res.status(400).send("placeholders are required");
  }

  try {
    const { data: svg } = await axios.get(svgUrl);

    const imageBuffer = await generateOGImage(svg, placeholders);
    res.header("Content-Type", "image/png");
    res.header("Content-Length", imageBuffer.length);
    // cache for 48 hours
    res.header("Cache-Control", "public, max-age=172800");
    res.header("Expires", new Date(Date.now() + 172800000).toUTCString());
    res.send(imageBuffer);
    console.log("Image generated successfully");
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
