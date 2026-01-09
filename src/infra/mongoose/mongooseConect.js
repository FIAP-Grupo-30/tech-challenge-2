const mongoose = require('mongoose');

async function connectDB() {
  try {
    const env = process.env.NODE_ENV || 'development';

    const forceMemory = (process.env.MONGO_IN_MEMORY || '').toLowerCase() === 'true';
    const useMemory = forceMemory || env === 'development' || env === 'test' || !process.env.MONGO_URI;

    if (useMemory) {
      // Use in-memory MongoDB for development, tests, or when explicitly forced
      console.log('Inicializando MongoDB em memória (mongodb-memory-server)');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      await mongoose.connect(mongoUri);
      console.log('Conectado ao MongoDB em memória');
      return;
    }

    // Em produção com MONGO_URI configurado
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    throw error; // Propagar para que o processo possa falhar ou ser observado
  }
}

module.exports = connectDB;