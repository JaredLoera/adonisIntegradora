/**
 * Config source: https://git.io/JvgAf
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

import { mailConfig } from '@adonisjs/mail/build/config'

export default mailConfig({
  /*
  |--------------------------------------------------------------------------
  | Default mailer
  |--------------------------------------------------------------------------
  |
  | The following mailer will be used to send emails, when you don't specify
  | a mailer
  |
  */
  mailer: 'smtp',

  /*
  |--------------------------------------------------------------------------
  | Mailers
  |--------------------------------------------------------------------------
  |
  | You can define or more mailers to send emails from your application. A
  | single `driver` can be used to define multiple mailers with different
  | config.
  |
  | For example: Postmark driver can be used to have different mailers for
  | sending transactional and promotional emails
  |
  */
  mailers: {
    /*
    |--------------------------------------------------------------------------
    | Smtp
    |--------------------------------------------------------------------------
    |
    | Uses SMTP protocol for sending email
    |
    */
    smtp: {
      driver: 'smtp',
      host: 'smtp.mailgun.org',
      port: '587',
			auth: {
				user: 'postmaster@sandbox167a8c9a6462432581470186c5854c62.mailgun.org',
				pass: '7c9d320c4439f3592d66e42520ac0c9e-48c092ba-29e6bfaa',
				type: 'login',
			}
    },
  },
})
