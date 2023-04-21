import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'

export default class extends BaseSeeder {
  public async run () {
    await Database.table('users').insert([
      { id: 1, rol_id: 1, name: 'eder', email: 'eder@gmail.com', password: await Hash.make('12345678'), status:1 }
    ])
    // Write your database queries inside the run method
  }
}
