const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Supabase config
const SUPABASE_URL = 'https://rhjdxycgkuavbdqnkqzt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoamR4eWNna3VhdmJkcW5rcXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1ODA1NTQsImV4cCI6MjA3MTE1NjU1NH0.cI7oJKjrY2CbRf3CnahjDeTdUuy7LgR_BpmxmTuiYBA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🛡️ Middleware
app.use(cors({
  origin: ['https://clasificadas.netlify.app'], // Asegura que Netlify pueda acceder
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// 🧪 Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 Backend activo y funcionando en Render');
});

// 📥 Ruta para recibir ubicación
app.post('/api/ubicacion', async (req, res) => {
  const { lat, lon, timestamp } = req.body;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Faltan coordenadas' });
  }

  try {
    const { error } = await supabase
      .from('ubicaciones')
      .insert([{ latitud: lat, longitud: lon, timestamp }]);

    if (error) {
      console.error('Error al insertar en Supabase:', error);
      return res.status(500).json({ error: 'Error al guardar ubicación' });
    }

    res.status(200).json({ message: 'Ubicación guardada correctamente' });
  } catch (err) {
    console.error('Error inesperado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 📤 Ruta para consultar ubicaciones
app.get('/api/ubicaciones', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ubicaciones')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error al obtener ubicaciones:', error);
      return res.status(500).json({ error: 'Error al consultar ubicaciones' });
    }

    if (!data || data.length === 0) {
      return res.status(200).json({ message: 'No hay ubicaciones registradas aún', data: [] });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Error inesperado al consultar:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
