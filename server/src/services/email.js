require('dotenv').config();
const nodemailer = require('nodemailer');
require('dotenv').config();
const pug = require('pug');
const htmlToText= require('html-to-text');

class email {
  constructor(user , url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Ahmed adel <${process.env.SENDGRID_EMAIL_FROM}>`
  }
  newTransporter(){
    if(process.env.NODE_ENV==='production') {
     // use sendgrid to send reals emails to users
     return nodemailer.createTransport({
      service:'SendGrid',
      auth:{
        user: process.env.SENDGRRID_USERNAME,
        pass: process.env.SENDGRRID_PASS,
      }
     })
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST  ,
      port : 587,
      auth: {
        user : process.env.EMAIL_USERNAME ,
        pass :process.env.EMAIL_PASSWORD ,
       }
     })
  }
  async send(template , subject) {
    const html = pug.renderFile(
      `${__dirname}/../../views/emails/${template}.pug`,
      {
        firstName:this.firstName,
        url:this.url,
        subject
      }
    )
    const mailOptions ={
      from :this.from,
      to:this.to,
      subject,
      html,
      text :htmlToText.fromString(html)
    }
    await this.newTransporter().sendMail(mailOptions);
  }

    async sendPasswordreset() {
      await this.send('passwordReset' ,'Your password token (valid for onlu 10 mints)');
    }

    async verificationToken(){
      await this.send('verificationToken' , 'your verification Token')
    }
  
}

module.exports= email;