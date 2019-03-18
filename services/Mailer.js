const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

class Mailer extends helper.Mail {
  constructor({ subject, recipient }, content) {
    super();

    this.sgApi = sendgrid(keys.sendGridKey);

    const body = new helper.Content('text/html', content);
    const from = new helper.Email('no-reply@mwaproject.com');
    const to = new helper.Email(recipient);

    this.mail = new helper.Mail(from, subject, to, body);
  }

  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.mail.toJSON()
    });

    return await this.sgApi.API(request);
  }
}

module.exports = Mailer;
