const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Coloca tu API key aquí:
const API_KEY = 'w1RzFyF5cF2N7n0b';

app.post('/api/descargar', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL no proporcionada' });
  }

  try {
    const response = await axios.get('https://tikwm.com/api', {
      params: {
        url,
        hd: 1,
        count: 1,
        key: API_KEY
      }
    });

    const data = response.data;

    if (data.code !== 0) {
      return res.status(400).json({ error: data.msg || 'Error al procesar el video' });
    }

    const videoSinMarca = data.data.play || data.data.play_hd;
    if (!videoSinMarca) {
      return res.status(404).json({ error: 'No se encontró video sin marca de agua' });
    }

    return res.json({ videoUrl: videoSinMarca });

  } catch (err) {
    console.error(err.message || err);
    return res.status(500).json({ error: 'Error del servidor al contactar con TikWM' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
