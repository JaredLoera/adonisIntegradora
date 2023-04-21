import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class Rol extends BaseModel {

  static get table() {
    return 'roles'
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public nombre:string

  
  @belongsTo(() => User)
  public users: BelongsTo<typeof User>

  serialize() {
    return {
      id: this.id,
      nombre: this.nombre,
      createdAt: this.createdAt.toISO(),
      updatedAt: this.updatedAt.toISO(),
    }
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
