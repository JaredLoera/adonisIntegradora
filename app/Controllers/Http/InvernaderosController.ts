// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from '@ioc:Adonis/Core/Event'
import { Readable } from 'stream';


const { MongoClient, ObjectId } = require('mongodb')
const uri = 'mongodb+srv://abel0120:01abel01@cluster0.mndru6r.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, { useUnifiedTopology: true })

export default class InvernaderosController {

  async createInvernadero({ request, response }) {
    try {
      const { nombre, ubicacion, usuario } = request.all();
  
      await client.connect();
      const db = client.db('sistemaSensores');
      const invernaderos = db.collection('invernaderos');
  
      const invernadero = await invernaderos.insertOne({
        nombre,
        ubicacion,
        usuario,
      });
  
      const insertedId = invernadero.insertedId;
      const insertedInvernadero = await invernaderos.findOne({ _id: insertedId });
  
      Event.emit('message', 'invernadero nuevo');
  
      return response.json({ datos: insertedInvernadero });
  
    } catch (error) {
      console.log(error);
      throw new Error('Error');
    } finally {
      await client.close();
    }
  }
  
    
    async getInvernadero({response,params}) {
        try {
          await client.connect();
          const database = client.db('sistemaSensores');
          const collection = database.collection('invernaderos');
    
          const {id}=params;
      
          const invernadero = await collection.findOne({ _id: ObjectId(id) });
      
          if (!invernadero) {
            return response.status(400).json({
              status: 400,
              mensaje: 'No se encontro el invernadero',
              error: null,
          });
          }
          return invernadero;
    
        } catch (error) {
          console.log(error);
          throw new Error('Error al buscar el documento');
        } finally {
          await client.close();
        }
      }

      async getSensores({ response, params }) {
        try {
          await client.connect();
          const database = client.db('sistemaSensores');
          const collection = database.collection('sensores');
      
          const { id } = params;
      
          const sensores = await collection.findOne({ invernadero_id: id });
      
          if (sensores.length === 0) {
            return response.status(400).json({
              status: 400,
              mensaje: 'No se encontraron sensores para este invernadero',
              error: null,
            });
          }
      
          return sensores;
      
        } catch (error) {
          console.log(error);
          throw new Error('Error al buscar los sensores');
        } finally {
          await client.close();
        }
      }

      async getInverSen({ response,params }) {
        let client;
        try {
          client = await MongoClient.connect(uri);
          const database = client.db('sistemaSensores');
          const collection = database.collection('DatosSensores');

          const { nombre } = params;
      
          const sensores = await collection.aggregate([
            {
              $match: {
                invernadero: nombre 
              }
            }
          ]).toArray();
      
          if (sensores.length === 0) {
            return response.status(200).json({
              status: 200,
              mensaje: 'No se encontraron sensores para este invernadero',
              error: null,
            });
          }
          return response.status(200).json({
            status: 200,
            mensaje: 'todo good',
            error: null,
            datos: sensores
          });
      
        } catch (error) {
          console.log(error);
          throw new Error('Error');
        } finally {
          if (client) {
            await client.close();
          }
        }
      }
      
      async getInvernaderos({ response }) {
        let client;
        try {
          client = await MongoClient.connect(uri);
          const database = client.db('sistemaSensores');
          const collection = database.collection('invernaderos');
      
          const invernaderos = await collection.find({}).toArray();
      
          if (!invernaderos) {
            return response.status(400).json({
              status: 400,
              mensaje: 'No se encontraron invernaderos',
              error: null,
            });
          }
          return response.json({ datos: invernaderos })
      
        } catch (error) {
          console.log(error);
          throw new Error('Error');
        } finally {
          if (client) {
            await client.close();
          }
        }
      }
      

      public async getInvernaderoSES({ response }) {
        response.response.setHeader('content-type', 'text/event-stream')
        response.response.setHeader('Access-Control-Allow-Origin', '*')
        response.response.setHeader('Cache-Control', 'no-cache')
        response.response.setHeader('Connection', 'keep-alive')
        const stream = new Readable({read(){}})
        response.response.write(':open\n\n')
  
        stream.push('data: hay cambios \n\n')
        response.response.write(stream.read())
  
        Event.on('message', (msj) =>{
          stream.push('data: '+msj+' emit:\n\n')
          response.response.write(stream.read())
        })
        }
}
