const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Only GET method allowed"
    });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      message: "Missing url parameter"
    });
  }

  try {
    const response = await axios.post(
      "https://api.snapany.com/v1/extract",
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

    // ✅ SnapAny real structure handling
    const downloadUrl =
      data?.data?.videos?.[0]?.url ||
      data?.data?.medias?.[0]?.url ||
      data?.videos?.[0]?.url ||
      null;

    if (!downloadUrl) {
      return res.status(404).json({
        success: false,
        message: "No media found"
      });
    }

    return res.status(200).json({
      success: true,
      author: "ItachiXD",
      platform: "Pinterest",
      download_url: downloadUrl
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Request failed",
      error: err.message
    });
  }
};
