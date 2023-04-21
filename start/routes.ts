/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'


Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('/user', 'UsuariosController.user').middleware('auth')

Route.group(() => {
  
Route.get('/user', 'UsuariosController.user')

}).prefix('v1').middleware('auth')


Route.group(() => {

  Route.post('crear/invernaderos','InvernaderosController.createInvernadero')


  //////////////////////////////////////////CONSULTAS//////////////////////////////////////////////////////////////
  Route.get('/mostrar/invernadero/:id','InvernaderosController.getInvernadero')

  Route.get('/mostrar/invernaderos','InvernaderosController.getInvernaderos')
  Route.get('/mostrar/invernaderosSES','InvernaderosController.getInvernaderoSES')

  Route.get('/mostrar/sensoresinver/:id','InvernaderosController.getSensores')

  Route.get('/mostrar/inverdatos/:nombre','InvernaderosController.getInverSen').where('nombre', /^[0-9a-zA-Z]+$/)

}).prefix('v4')//.middleware('auth')

Route.group(() => {
  Route.post('/crear/usuario','UsuariosController.createUser')

  Route.post('/modificar/usuario/:id','UsuariosController.modificarUsuario')
  Route.post('/crear/admin','UsuariosController.createAdmin')
  Route.get('/rol','UsuariosController.rol')

  Route.post('/usuario/correoexiste','UsuariosController.checkEmailExists')
  Route.get('/consultar/usuarios','UsuariosController.getUsersWithRoles').middleware('auth')
  Route.get('/consultar/usuario/:id','UsuariosController.show')
  Route.put('/modificar/usuario/:id', 'UsuariosController.modificarUsuario')
  Route.put('/eliminar/usuario/:id', 'UsuariosController.eliminarUsuario')//.middleware('auth')
  Route.post('/verificar/usuariosms/:id','UsuariosController.verificarUsuarioSMS')
  Route.post('/login', 'UsuariosController.login')
  Route.post('/login/usuario','UsuariosController.loginUsuario')
  Route.post("/verificar/usuario/:id","UsuariosController.verificarUsuario").as('verifyEmail')
  Route.post('/logout/usuario', 'UsuariosController.logoutUsuario')//.middleware('auth')
  Route.get('/usuario','UsuariosController.verUsuario').middleware('auth')

}).prefix('v1')

