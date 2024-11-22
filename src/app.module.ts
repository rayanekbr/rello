import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule, MongooseModule.forRoot('mongodb+srv://rayane:Rayane02*+@cluster0.vas9j.mongodb.net/', {

    onConnectionCreate: (connection) => {
      connection.on('connected', () => console.log('connected'));
    }


  }), 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
