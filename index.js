const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// Pretty print helper
const pretty = (obj) => JSON.stringify(obj, null, 2);

// Root
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(
    pretty({
      author: "ItachiXD",
      status: "Pinterest Downloader API Running",
      usage: "/api/download?url=PIN_URL"
    })
  );
});

// MAIN API
app.get("/api/download", async (req, res) => {
  try {
    const pinUrl = req.query.url;

    if (!pinUrl) {
      return res.status(400).send(
        pretty({
          success: false,
          error: "Missing ?url parameter"
        })
      );
    }

    const apiRes = await axios.get(
      "https://downloadpins.net/api/search",
      {
        params: { v: pinUrl },
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-US,en;q=0.9",
          "Referer": "https://downloadpins.net/",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/137.0.0.0 Mobile Safari/537.36"
        },
        timeout: 15000
      }
    );

    res.setHeader("Content-Type", "application/json");
    res.send(
      pretty({
        author: "ItachiXD",
        success: true,
        data: apiRes.data
      })
    );
  } catch (err) {
    console.error("ERROR:", err.message);

    res.status(500).send(
      pretty({
        author: "ItachiXD",
        success: false,
        error: "Upstream API failed",
        details: err.response?.data || err.message
      })
    );
  }
});

// EXPORT FOR VERCEL (IMPORTANT)
module.exports = app;
