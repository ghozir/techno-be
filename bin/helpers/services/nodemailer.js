const nodemailer = require('nodemailer');
const { existsSync, readFileSync } = require('fs');
const { resolve } = require('path');
const hbs = require('handlebars');

const viewPath = (path) => resolve(__dirname, `../../../views/${path}.html`);

const renderTemplate = (template, data) => {
  const templateContent = readFileSync(
    viewPath(`email-template/${template}`),
    'utf8'
  );
    // const layoutName = templateContent.match(/^{{#> ([a-z\-_]+)/)[1];
    // const layoutContent = readFileSync(
    //   viewPath(`partials/${layoutName}`),
    //   'utf8'
    // );
    // hbs.registerPartial(layoutName, layoutContent);
  const renderer = hbs.compile(templateContent);
  return renderer(data);
};

// eslint-disable-next-line no-async-promise-executor
const sendEmail = async (params) => {

  // Validation: make sure template is exists
  const templatePath = viewPath(`email-template/${params.template}`);
  if (!existsSync(templatePath))
    return ({
      code: 422,
      message: 'Template name provided in parameter is not exist',
    });

  // Prepare the payload
  let transporter = nodemailer.createTransport(
    {
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

  const sendEmails = await transporter.sendMail({
    from: params.from,
    to:  params.to,
    subject: params.subject,
    text:'testing aja',
    html: renderTemplate(params.template, params.content)
  });

  return sendEmails;
};

module.exports = {
  renderTemplate,
  sendEmail,
};
