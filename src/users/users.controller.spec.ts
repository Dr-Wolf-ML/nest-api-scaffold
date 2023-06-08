import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
    let controller: UsersController;
    let fakeUsersService: Partial<UsersService>;
    let fakeAuthService: Partial<AuthService>;

    beforeEach(async () => {
        fakeUsersService = {
            // create a fake function called findOne
            findOne(id: number) {
                return Promise.resolve({
                    id,
                    email: 'test@test.com',
                    password: 'password',
                } as User);
            },

            // create a fake function called find
            find(email: string) {
                return Promise.resolve([
                    { id: 1, email, password: 'password' } as User,
                ]);
            },

            // create a fake function called remove
            remove(id: number) {
                return Promise.resolve({ id } as User);
            },

            // create a fake function called update
            update(id: number, attrs: Partial<User>) {
                return Promise.resolve({ id, ...attrs } as User);
            },
        };
        fakeAuthService = {
            // create a fake function called signup
            signup(email: string, password: string) {
                return Promise.resolve({ id: 1, email, password } as User);
            },

            // create a fake function called signin
            signin(email: string, password: string) {
                return Promise.resolve({ id: 1, email, password } as User);
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                { provide: UsersService, useValue: fakeUsersService },
                { provide: AuthService, useValue: fakeAuthService },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('findAllUsers returns a list of users with the given email', async () => {
        const users = await controller.findAllUsers('test@test.com');
        expect(users.length).toEqual(1);
        expect(users[0].email).toEqual('test@test.com');
    });

    it('findUser returns a single user with the given id', async () => {
        const user = await controller.findUser('1');
        expect(user).toBeDefined();
    });

    it('findUser throws an error if user with given id is not found', async () => {
        fakeUsersService.findOne = () => null;
        await expect(controller.findUser('1')).rejects.toThrow(
            NotFoundException
        );
    });

    it('removeUser returns a single user with the given id', async () => {
        const user = await controller.removeUser('1');
        expect(user.id).toEqual(1);
    });

    it('updateUser returns a single user with the given id and attrs', async () => {
        const user = await controller.updateUser('1', {
            email: 'updated-test@test.com',
            password: 'password1',
        });
        expect(user.id).toEqual(1);
        expect(user.email).toEqual('updated-test@test.com');
        expect(user.password).toEqual('password1');
    });

    it('signin updates session object and returns a user', async () => {
        const session = { userId: -10 };

        const user = await controller.signin(
            {
                email: 'test@test.com',
                password: 'password',
            },
            session
        );
        expect(user.id).toEqual(1);
        expect(session.userId).toEqual(1);
        expect(user.email).toEqual('test@test.com');
        expect(user.password).toEqual('password');
    });

    it('signup creates a new user and returns the user', async () => {
        const session = { userId: -10 };

        const user = await controller.createUser(
            {
                email: 'test@test.com',
                password: 'password',
            },
            session
        );
        expect(user.id).toEqual(1);
        expect(user.email).toEqual('test@test.com');
        expect(user.password).toEqual('password');
    });
});
