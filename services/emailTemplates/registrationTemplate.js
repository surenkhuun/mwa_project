module.exports = data => {
  return `
    <html>
      <body>
          <h3>Hey ${data.name},</h3>
          <p>Your password is:</p>
          <p>${data.password}</p>
      </body>
    </html>
  `;
}
