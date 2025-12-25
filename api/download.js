const axios = require("axios");

// Pretty print helper
function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

module.exports = async (req, res) => {
  try {
    const pinUrl = req.query.url;

    if (!pinUrl) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).send(
        pretty({
          author: "ItachiXD",
          success: false,
          message: "Missing ?url parameter"
        })
      );
    }

    const apiUrl = "https://downloadpins.net/api/search";

    const response = await axios.get(apiUrl, {
      params: { v: pinUrl },
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://downloadpins.net/",
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
      },
      timeout: 15000
    });

    res.setHeader("Content-Type", "application/json");
    return res.status(200).send(
      pretty({
        author: "ItachiXD",
        success: true,
        source: "downloadpins.net",
        data: response.data
      })
    );
  } catch (err) {
    console.error("❌ Error:", err.message);

    res.setHeader("Content-Type", "application/json");
    return res.status(500).send(
      pretty({
        author: "ItachiXD",
        success: false,
        message: "Failed to fetch Pinterest data",
        error: err.response?.data || err.message
      })
    );
  }
};
