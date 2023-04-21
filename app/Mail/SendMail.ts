import Mail from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'

export default class WelcomeMail {
  private user: User

  constructor(user: User) {
    this.user = user
  }

  public async prepare(mail) {
    mail
      .to(this.user.email)
      .from('your_email_address')
      .subject('Welcome to my website')
      .htmlView('emails/welcome', { name: this.user.name })
  }

  public async send() {
    await Mail
  }
}
