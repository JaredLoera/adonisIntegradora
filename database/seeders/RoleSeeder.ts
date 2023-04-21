import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'


export default class extends BaseSeeder {
  public async run () {
    await Database.table('roles').insert([
      {id:1, nombre: 'Admin' },
      {id:2, nombre: 'Usuario' },
      {id:3, nombre: 'Invitado' }
    ])
    // Write your database queries inside the run method
  }
}
