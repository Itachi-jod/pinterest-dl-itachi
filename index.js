const axios = require("axios");

module.exports = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "Missing url parameter"
      });
    }

    const api = "https://api.snapany.com/v1/extract";

    const response = await axios.post(
      api,
      { url },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Origin": "https://snapany.com",
          "Referer": "https://snapany.com/",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36"
        },
        timeout: 20000
      }
    );

    const data = response.data;

    const downloadUrl =
      data?.media?.[0]?.url ||
      data?.url ||
      null;

    return res.status(200).json({
      success: true,
      author: "ItachiXD",
      platform: "Pinterest",
      download_url: downloadUrl
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "No media found",
      error: err.message
    });
  }
};
