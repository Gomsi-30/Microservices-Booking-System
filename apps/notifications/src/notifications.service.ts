import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}

    private readonly transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',  // Yah host set karta hai jo ki Gmail ka SMTP server hai. SMTP (Simple Mail Transfer Protocol) email bhejne ke liye use hota hai.
        port: 465,   // Yah port set karta hai jo ki 465 hai, jo secure email communication ke liye use hota hai.
        secure: true,   // Yah specify karta hai ki secure connection (SSL/TLS) use hoga.
        auth: {
          type: 'OAuth2',  // Yah authentication ke type ko specify karta hai, jo ki OAuth2 hai. OAuth2 ek secure authorization method hai.
          user: this.configService.get('SMTP_USER'),
          clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
          clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
          refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
          accessToken: this.configService.get('GOOGLE_OAUTH_ACCESS_TOKEN'),
        },
      });
  
    async sending(data) {
      console.log(data.Body)
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_USER'),
        to: data.email,
        subject: 'Payments Notification',
        text:data.Body,
      });
    }

    async forgot(data) {
      const link = `http://localhost:3001/users/reset-password?token=${data.token}`
      console.log(data.Body)
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_USER'),
        to: data.email,
        subject: 'Forgot Password Notification',
        html: `${data.email} Please click the following link to reset your password: <a href="${link}">Forgot Password</a>`,
      });
    }
}
