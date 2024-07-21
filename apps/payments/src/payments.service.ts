// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import Stripe from 'stripe';

// @Injectable()
// export class PaymentsService {
//   constructor(private readonly config:ConfigService){}
//   private readonly stripe = new Stripe(this.config.get('STRIPE_KEY'),{
//     apiVersion:'2024-06-20'
//   })

//   async pay(data:any){
//     console.log(data)
//     const paymentIntents = await this.stripe.paymentIntents.create({
//       amount: data.amount,
//       currency: data.currency,
//       payment_method: data.payment_method,
//       confirm:true,
//       automatic_payment_methods: {
//         enabled: true,   // Automatic payment methods use karne se aapka payment process simple ho jata hai aur Stripe khud different payment methods handle karta hai.
//         allow_redirects: 'never',
//       }
//     })
      
//         return paymentIntents;
//       }
//   }





import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { NOTIFICATION_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class PaymentsService {
  constructor(@Inject(NOTIFICATION_SERVICE) readonly notification:ClientProxy, private readonly config:ConfigService){}
  private readonly stripe = new Stripe(this.config.get('STRIPE_KEY'),{
    apiVersion:'2024-06-20'
  })

  async createCheckoutSession({amount,quantity,email,pname,name,startDate,endDate,rooms,peoples}){
    // console.log('mai hu start date' + startDate)
    // console.log('mai hu start date' + amount)
    // console.log('mai hu start date' + quantity)
    // console.log('mai hu start date' + email)
    // console.log('mai hu start date' + peoples)
    const item = [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: pname,
          // images: [
          //   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReNzMBgJpJX_YhDlB78viD8CJ1cHI4yljZFA&s'
          // ],
        },
        unit_amount: amount*100, // price in cents
      },
      quantity: quantity,
    }];

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['GB', 'US', 'CA'],
      },
      line_items: item,
      mode: 'payment',
      success_url: 'http://localhost:3002/', // Adjust URL as needed
      cancel_url: 'http://localhost:3000/cancel', // Adjust URL as needed
      // metadata: {
      //   productName,
      // },
    });
    console.log(session.id);

    this.notification.emit('message',{
        email,
        amount,
        Body : `Dear ${name},

        We are delighted to inform you that your payment has been successfully processed.
        
        Reservation Details:
        
        Start Date: ${startDate}
        End Date: ${endDate}
        Rooms: ${rooms}
        People: ${peoples}
        Total Amount: ${amount}
        Thank you for choosing our services. If you have any questions or need further assistance, please feel free to contact us.` 
    })
    return {id:session.id};
  }
}
