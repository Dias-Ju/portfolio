require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

const PORT = 5000;

const REDIRECT_URI = "http://127.0.0.1:5000/retorno_de_chamada";

app.use(cors());

let spotifyToken = "";
let tokenExpiresAt = 0;

async function getSpotifyToken() {
  const now = Date.now();
  if (spotifyToken && now < tokenExpiresAt) {
    return spotifyToken; 
  }

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const authHeader = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

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

    spotifyToken = response.data.access_token;
    tokenExpiresAt = now + response.data.expires_in * 1000 - 5000; // expira um pouco antes
    console.log("Novo token Spotify gerado");
    return spotifyToken;
  } catch (error) {
    console.error("Erro ao pegar token:", error.response?.data || error.message);
    return null;
  }
}

app.get("/token", async (req, res) => {
  const token = await getSpotifyToken();
  if (token) {
    res.json({ token });
  } else {
    res.status(500).json({ error: "Não foi possível gerar token" });
  }
});

app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Query ausente" });

  const token = await getSpotifyToken();
  if (!token) return res.status(500).json({ error: "Token inválido" });

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          q: query,
          type: "track",
          limit: 5,
        },
      }
    );

    res.json({ tracks: response.data.tracks.items });
  } catch (error) {
    console.error("Erro ao buscar músicas:", error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao buscar músicas" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


