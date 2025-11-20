const express = require("express");
const axios = require("axios");
const cors = require("cors");
const FormData = require("form-data");

const app = express();
app.use(cors());
app.use(express.json());

// Always pretty-print JSON
app.set("json spaces", 2);

// REAL UPSTREAM URL (from DevTools)
const UPSTREAM = "https://tools.xrespond.com/api/social/all/downloader";

// ROOT ENDPOINT
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Pinterest Downloader API by Itachi",
    endpoint: "/download?url=",
    author: "Lord Itachi"
  });
});

// PINTEREST DOWNLOADER
app.get("/api/download", async (req, res) => {
  const pinUrl = req.query.url;

  if (!pinUrl) {
    return res.status(400).json({
      success: false,
      message: "Missing ?url=",
    });
  }

  try {
    // Browser-accurate multipart/form-data
    const form = new FormData();
    form.append("url", pinUrl);

    // Exact DevTools headers (works 100%)
    const headers = {
      ...form.getHeaders(),
      "Accept": "*/*",
      "Origin": "https://downsocial.io",
      "Referer": "https://downsocial.io/",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36"
    };

    const response = await axios.post(UPSTREAM, form, { headers });

    // Fix escaped slashes
    let raw = response.data;
    raw = JSON.stringify(raw).replace(/\\\//g, "/");
    raw = JSON.parse(raw);

    res.json({
      success: true,
      author: "ItachiXD",
      platform: "pinterest",
      data: raw.data || raw
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Upstream API failed",
      error: err.response?.data || err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🔥 Pinterest API running on port ${PORT}`)
);

module.exports = app;
