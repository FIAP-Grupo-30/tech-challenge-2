const mongoose = require('mongoose');

async function connectDB() {
  try {
    const env = process.env.NODE_ENV || 'development';

    if (env === 'development' || env === 'test') {
      // Use in-memory MongoDB only for development and tests
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      await mongoose.connect(mongoUri);
      console.log('Conectado ao MongoDB em memória');
      return;
    }

    // Em produção, requerer MONGO_URI
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI não está definido em ambiente de produção');
    }

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