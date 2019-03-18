const keys = require('../../config/keys');

module.exports = token => {
  return `
    <html>
      <body>
        <p>You have been invited to take an exam, please click on the link below:</p>
        <p><a href="${keys.domain}exams/take/${token}">Start exam</a></p>
      </body>
    </html>
  `;
}
