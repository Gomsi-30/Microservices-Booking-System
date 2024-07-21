import { Test, TestingModule } from '@nestjs/testing';  // NestJS testing modules import karte hain
import { UsersController } from './users.controller';   // UsersController import karte hain
import { UsersService } from './users.service';         // UsersService import karte hain          
import { UsersDto } from './dto/users.dto';                                                  // UsersDto import karte hain
import { ConflictException, NotFoundException } from '@nestjs/common';     // ConflictException import karte hain
import { GetUserDto } from './dto/get-user.dto';
import { rejects } from 'assert';
import { UsersDocument } from './entity/users.schema';


describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({  // Testing module create karte hain
      controllers: [UsersController],  // UsersController ko define karte hain
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),  // Mock function for create method
            forgot: jest.fn()
          },
        },
      ],
    }).compile();  // Module ko compile karte hain

    usersController = module.get<UsersController>(UsersController);  // UsersController ka instance get karte hain
    usersService = module.get<UsersService>(UsersService);  // UsersService ka instance get karte hain
  });

  it('should create a user', async () => {
    const usersData = {
      name:'test',
      email: 'test@example.com',
      password: 'password123',
     
    };

    const result:UsersDocument = {
      //id: 'dsf',
      ...usersData,
      password: 'hashedPassword123',
      tempToken:34
    };

    jest.spyOn(usersService, 'create').mockImplementation(async () => result);  // Mock implementation for create method

    expect(await usersController.create(usersData)).toBe(result);  // Expectation set karte hain ki create method sahi se kaam karta hai
  });

  it('should throw ConflictException if user already exists', async () => {
    const usersData:UsersDto = {
      name:'test',
      email: 'test@example.com',
      password: 'password123',
    };

    jest.spyOn(usersService, 'create').mockImplementation(() => {
      throw new ConflictException('User Already Exist');  // Mock implementation jo exception throw karega agar user already exist hai
    });

    await expect(usersController.create(usersData)).rejects.toThrow(ConflictException);  // Expectation set karte hain ki ConflictException throw hota hai
  });

  it('forget password',async ()=> {
      const data = {
         email:'',
         id:1
      };

      const result = '';

      jest.spyOn(usersService,'forgot').mockImplementation(async () => result)
      expect(await usersController.forgot(data)).toBe(result);
  })

  it('should throw user not found error', async () => {
    const data = {
        email:'',
        id:1
     };

    jest.spyOn(usersService,'forgot').mockImplementation(async () => {
        throw new NotFoundException()
    })
    
    expect(usersController.forgot(data)).rejects.toThrow(NotFoundException)
  })
});
