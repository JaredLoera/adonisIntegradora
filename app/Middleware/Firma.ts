import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
//import { RequestContract } from '@ioc:Adonis/Core/Request';
const Mailgun = require('mailgun-js');

//type QueryStringFn = () => QueryString;

interface QueryString {
  signature: string;
  timestamp: string;
  token: string;
}

export default class Firma {
  async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const API_KEY = process.env.MAILGUN_API_KEY;
    const DOMAIN = process.env.MAILGUN_DOMAIN;
    const mailgun = Mailgun({ apiKey: API_KEY, domain: DOMAIN });

    const isQueryString = (qs: unknown): qs is QueryString => {
      const possibleQueryString = qs as QueryString;
      return possibleQueryString.signature !== undefined
        && possibleQueryString.timestamp !== undefined
        && possibleQueryString.token !== undefined;
    };

    
    const qs = request.qs;
    if (!isQueryString(qs)) {
      return response.status(400).send({ error: 'Firma de URL faltante.' });
    }

      if (!qs || !qs.signature) {
    return response.status(400).send({ error: 'Firma de URL faltante.' });
    }

    const options = {
      url: `${process.env.APP_URL}${request.url()}`,
      timestamp: qs.timestamp,
      token: qs.token,
      signature: qs.signature
    };

    try {
      const isValid = mailgun.validateWebhook(options, qs.signature);
      if (isValid) {
        await next();
      } else {
        return response.status(401).send({ error: 'Firma de URL no válida.' });
      }
    } catch (error) {
      console.error(error);
      return response.status(500).send({ error: 'Error de servidor.' });
    }
  }
}
