import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { ListsModule } from './list/lists.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://rayane:Rayane02*+@cluster0.vas9j.mongodb.net/',
      {
        onConnectionCreate: (connection) => {
          connection.on('connected', () => console.log('connected'));
        },
      },
    ),
    BoardsModule,
    AuthModule,
    UsersModule,
    ListsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
