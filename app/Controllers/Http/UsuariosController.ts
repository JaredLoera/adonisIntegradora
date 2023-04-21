// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User"
import Hash from "@ioc:Adonis/Core/Hash"
import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
/*import Env from '@ioc:Adonis/Core/Env'
import Route from '@ioc:Adonis/Core/Route'
import Mail from "@ioc:Adonis/Addons/Mail"*/
import Joi from "joi"
/*import { Response } from "@adonisjs/core/build/standalone"
import axios from "axios"
import UserSeeder from "Database/seeders/UserSeeder"
import AuthActiveStatus from "App/Middleware/AuthActiveStatus"*/
import Database from "@ioc:Adonis/Lucid/Database"
const { Vonage } = require('@vonage/server-sdk')
//import SendMail from 'App/Mail/SendMail'¿

export default class UsuariosController {
   axios = require('axios')
  
    ///////////////////////////////////////////////CREAR y MODIFICAR USUARIOS/ADMIN///////////////////////////////////////////////////////////////////////////////
   
    async createUser ({ request, response }) {
      const email = request.input('email')
      const existingUser = await User.findBy('email', email)
    
      if (existingUser) {
        return response.status(400).json({
          status: 400,
          mensaje: 'El email ya está en uso',
          error: null,
          data: []
        })
      }
    
      const user = new User()
      user.name = request.input('name')
      user.email = request.input('email')
      user.rol_id = 2
      user.status = 1
      user.password = await Hash.make(request.input('password'))
    
      if (await user.save()) {
    
        /*const url = Route.makeSignedUrl('verifyEmail', {
          id:user.id
        })
    
        await Mail.send((message) => {message
          .to('egmr.49@gmail.com')
          .from('sender@example.com')
          .subject('Welcome')
          message.htmlView('emails/welcome', {
            user: { fullName: user.name },
            url: url,
          })
        })*/
    
        return response.status(201).json({
          status: 201,
          mensaje: 'Usuario registrado',
          error: null,
          data: user,
          //url:url
        });
      }
    }
    
    
    public async createAdmin ({ request, response }) {
    
            const email = request.input('email')
            const existingUser = await User.findBy('email', email)

            const validationSchema = schema.create({
                name: schema.string({ trim: true }, [
                ]),
                email: schema.string({ trim: true }, [
                ]),
                password: schema.string({ trim: true }, [
                ]),
              })
          
              await request.validate({
                schema: validationSchema,
                messages: {
                  'required': 'El campo {{field}} es obligatorio',
                },
              })

    
            if (existingUser) {
            return response.status(400).json({
                status: 400,
                mensaje: 'El email ya está en uso',
                error: null,
                data: []
            })
            }
        
            if (existingUser) {
                return response.status(400).json({
                status: 400,
                mensaje: 'El email ya está en uso',
                error: null,
                data: [],
                })
            }
            
                const user = new User()
                user.name = request.input('username')
                user.email = request.input('email')
                user.rol_id = 1
                user.password = await Hash.make(request.input('password'))
            
                if (await user.save()) {
                return response.status(201).json({
                    status: 201,
                    mensaje: 'Admin registrado',
                    error: null,
                    data: user.serialize()
                })
                }
        }

   /* public async modificarUsuario({ request, response, params }: HttpContextContract) {
            const usuario = await User.find(params.id)
          
            if (!usuario) {
              return response.status(404).json({
                status: 404,
                mensaje: 'Usuario no encontrado',
                error: null,
              })
            }
          
            const { name, email, password, rol_id } = await request.validate({
              schema: schema.create({
                name: schema.string({ trim: true }),
                email: schema.string({ trim: true }, [
                  rules.email(),
                  rules.unique({ table: 'users', column: 'email', whereNot: { id: usuario.id } }),
                ]),
                password: schema.string({ trim: true }),
                rol_id: schema.number([rules.exists({ table: 'roles', column: 'id' })]),
              }),
            })
          
            usuario.name = name
            usuario.email = email
            if (password) {
              usuario.password = await Hash.make(request.input('password'))
            }
            usuario.rol_id = rol_id
          
            await usuario.save()
          
            return response.status(200).json({
              status: 200,
              mensaje: 'El usuario ha sido modificado exitosamente',
              error: null,
              data: usuario,
            })
          }*/

          
    
  
    ///////////////////////////////////////////////LOGIN USUARIOS Y ADMIN/LOGOUT/////////////////////////////////////////////////////////////////////

  async login({ request, response, auth }) {
    try {
      const validationSchema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      });
  
      const validatedData = await validationSchema.validateAsync(request.all());
      const user = await User.findBy('email', validatedData.email);
  
      if (!user) {
        return response.status(400).json({ message: 'Credenciales incorrectas' });
      }
  
      const isPasswordValid = await Hash.verify(user.password, request.input('password'));
      if (!isPasswordValid) {
        return response.status(400).json({ message: 'Credenciales incorrectas' });
      }
  
  
      try {
        const token = await auth.use('api').generate(user)
        return response.status(200).json({
          status: 200,
          mensaje: 'todo bien',
          error: null,
          data: user,
          token: token.token
        });
  
      } catch (error) {
        return response.status(400).json({
          status: 400,
          mensaje: 'Ha ocurrido un error al intentar autenticar al usuario',
          error: error.message,
          data: user,
        });
      }
  
    } catch (error) {
      return response.status(400).json({
        status: 400,
        mensaje: 'Validación no exitosa',
        error: error.message,
        data: []
      });
    }
  }


  async logoutUsuario ({response, auth }: HttpContextContract) {
    await auth.use('api').revoke()

    return response.ok({
        'status': 200,
        'mensaje': 'Sesión cerrada correctamente.',
        'error': [],
        'data': [],
    })
  }


  public async verificarUsuario({response, params }: HttpContextContract) {

    const user = await User.findBy('id', params.id)

    if (!user) {
      throw new Error('No se encontró ningún usuario con el ID especificado');
    }

    const vonage = new Vonage({
      apiKey: "89ca7390",
      apiSecret: "sFI3tYAjqElnKZGf"
    })

    
    const code: number = Math.floor(Math.random() * 9000) + 1000;

    const from = "Vonage APIs"
    const to = "528714149701"
    const text = code

    user.code = code;
    if (await user.save())
    {
    await vonage.sms.send({to, from, text})
    .then(resp => { 
      console.log('Message sent successfully'); console.log(resp);
    
      return response.status(200).json({
        status: 200,
        mensaje: 'todo bien',
        error: null,
        data: user
      });
    })
      .catch(err => { 
        console.log('There was an error sending the messages.'); console.error(err); 
        return response.status(400).json({
          status: 400,
          mensaje: 'Ha ocurrido un error al intentar mandar el codigo',
          error: err.message,
          data: user,
        });
      });
    }
  }


  public async verificarUsuarioSMS ({ params, request, response }) {

    try {
      const validationSchema = Joi.object({
        codigo: Joi.number().required(),
      });

      await request.validate({
        schema: validationSchema,
        messages: {
          'required': 'El campo {{field}} es obligatorio',
        },
      })

    const user = await User.findBy('id', params.id)

    if (!user) {
      throw new Error('No se encontró ningún usuario con el ID especificado');
    }

    const codigo = request.input('codigo');

    if(user.code == codigo)
    {
      user.status=1
      await user.save()

      return response.status(200).json({
        status: 200,
        mensaje: 'todo bien',
        error: null,
        data: user
      });
    }
    else
    {
      return response.status(400).json({
        status: 400,
        mensaje: 'Codigo invalido',
        error: null,
      });
    }
  } catch (error) {
    return response.status(400).json({
      status: 400,
      mensaje: 'Validación no exitosa',
      error: error.message,
      data: []
    });
  }
}


///////////////////////////////////////////////CONSULTAS/////////////////////////////////////////////////////////////////////

public async checkEmailExists ({ request, response }: HttpContextContract) {

  
    const email = request.input('email')
    if (!email) {
      return response.badRequest('Email is required')
    }

    const user = await User.findBy('email', email)

    if (user) {
      return response.json({ exists: true })
    } else {
      return response.json({ exists: false })
    }
  }


  public async show({response, params}:HttpContextContract){
    const user = await User.find(params.id)
    if (!user) {
        return response.status(404).json({
          status: 404,
          mensaje: 'Usuario no encontrado',
          error: null,
        })
      }
    return response.status(200).json({
      status: 200,
      mensaje: 'Usuario encontrado',
      error: [],
      data: user
    });
    
  }

  public async getUsersWithRoles ({ response }: HttpContextContract) {
    const user = await Database.query().from('users')
    .select('users.id as id','users.name as name', 
    'users.email as email', 'users.password as password', 'users.status as status', 
    'roles.nombre as rol_name').join('roles','roles.id', 'users.rol_id')
    .where('users.status', '=', 1);

    return response.status(200).json({
      status: 200,
      mensaje: 'Usuario encontrado',
      error: [],
      data: user
    });
  }

  public async consultarUsuario({response}){
    const user = await Database.query().from('users').select().first()

    return response.status(200).json({
      status: 200,
      mensaje: 'Usuario encontrado',
      error: [],
      data: user
    });
  }

  public async verUsuario({auth, response})
  {
    const user = await auth.use('api').authenticate()

    return response.status(200).json({
      status: 200,
      mensaje: 'Usuario encontrado',
      error: [],
      data: user
    });
  }

  public async user({auth})
  {
    const user = await auth.use('api').authenticate()

    return user;
  }

  public async rol({response}){
    const rol = await Database.query().from('roles').select('*')

    return response.status(200).json({
      status: 200,
      mensaje: 'Usuario encontrado',
      error: [],
      data: rol
    });
  }

  public async modificarUsuario({params, response, request})
  {
    const usuario = await User.find(params.id)

    if (!usuario) {
      return response.status(404).json({
        status: 404,
        mensaje: 'Usuario no encontrado',
        error: null,
      })
    }

    try {
      const validationSchema = Joi.object({
          name: Joi.string().required(),
          email: Joi.string().required(),
          rol_id:Joi.number().required(),
          status:Joi.number().required()
      });

      await request.validate({
        schema: validationSchema,
        messages: {
          'required': 'El campo {{field}} es obligatorio',
        },
      })

      usuario.name = request.input('name')
      usuario.email = request.input('email')
      usuario.rol_id = request.input('rol_id')
      usuario.status = request.input('status')

      try {
        await usuario.save();
      } catch (error) {
        return response.status(500).json({
          status: 500,
          mensaje: 'Ocurrió un error al guardar los datos',
          error: error.message,
          data: []
        });
      }

      return response.status(201).json({
        status: 201,
        mensaje: 'Los datos se insertaron de manera correcta',
        error: null,
        data: usuario
      });
    }
    
    catch (error){
      return response.status(400).json({
        status: 400,
        mensaje: 'Validación no exitosa',
        error: error.message,
        data: []
      });
    }

  }

  public async eliminarUsuario({params, response}){

    const usuario = await User.find(params.id)

    if (!usuario) {
      return response.status(404).json({
        status: 404,
        mensaje: 'Usuario no encontrado',
        error: null,
      })
    }

    usuario.status = 0;

    try {
      await usuario.save();
    } catch (error) {
      return response.status(500).json({
        status: 500,
        mensaje: 'Ocurrió un error al guardar los datos',
        error: error.message,
        data: []
      });
    }

    return response.status(201).json({
      status: 201,
      mensaje: 'Los datos se insertaron de manera correcta',
      error: null,
      data: usuario
    });
  }

}
