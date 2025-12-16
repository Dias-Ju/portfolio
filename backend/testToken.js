require("dotenv").config();
const axios = require("axios");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function testSpotifyToken() {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Token gerado com sucesso!");
    console.log("Token:", response.data.access_token);
    console.log("Expira em (segundos):", response.data.expires_in);
  } catch (error) {
    console.error("Erro ao gerar token:", error.response?.data || error.message);
  }
}

testSpotifyToken();
