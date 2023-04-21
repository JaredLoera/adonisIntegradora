import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthActiveStatus {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    const user = auth.user;
    if (user?.status === 1) {
      await next();
    } else {
      return response.status(403).send({ message: user });
    }
  }
}
