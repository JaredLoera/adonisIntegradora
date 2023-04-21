import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {

  static get table() {
    return 'users'
  }
  
  @column({ isPrimary: true })
  public id: number

  @column()
  public rol_id:number

  @column()
  public name:string

  @column()
  public email:string

  @column()
  public password:string

  @column()
  public status:number 

  @column()
  public code:number

  serialize() {
    return {
      id: this.id,
      rol_id:this.rol_id,
      name: this.name,
      email: this.email,
      password: this.password,
      status: this.status,
      createdAt: this.createdAt?.toISO(),
      updatedAt: this.updatedAt?.toISO(),
    }
  }


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
