import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminRol {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    const user = auth.user;
    if (user?.rol_id === 1) {
      await next();
    } else {
      return response.status(400).send({ message: 'No authorizado' });
    }
  }
}
