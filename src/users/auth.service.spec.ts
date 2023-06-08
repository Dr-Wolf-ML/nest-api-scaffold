import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';

import { User } from './user.entity';

describe('AuthService', () => {
    let authService: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // create a fake copy of the users service
        const users: User[] = [];

        fakeUsersService = {
            // create a fake function called find
            find: (email: string) => {
                const filteredUsers = users.filter(
                    (user) => user.email === email
                );
                return Promise.resolve(filteredUsers);
            },
            // create a fake function called create
            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 1000000),
                    email,
                    password,
                } as User;

                users.push(user);
                return Promise.resolve(user);
            },
        };

        // create a fake module
        const fakeModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                },
            ],
        }).compile();

        // get the instance of the auth service
        authService = fakeModule.get(AuthService);

        // create a user
        await authService.signup('test@test.com', 'password');
    });

    it('can create an instance of auth service', async () => {
        // expect the instance to be defined
        expect(authService).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await authService.signin('test@test.com', 'password');

        // expect the user to have the email that was passed in
        expect(user.email).toEqual('test@test.com');

        // expect the user to have a password that is not equal to the one that was passed in
        expect(user.password).not.toEqual('password');

        // expect the user to have a password that has a salt and a hash
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(salt).toHaveLength(16);
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
        await expect(
            authService.signup('test@test.com', 'password')
        ).rejects.toThrow(BadRequestException);
    });

    it('throws an error if signin is called with an unused email', async () => {
        await expect(
            authService.signin('asdflkj@asdlfkj.com', 'password')
        ).rejects.toThrow(NotFoundException);
    });

    it('throws an error if an invalid password is provided', async () => {
        await expect(
            authService.signin('test@test.com', 'laskdjf')
        ).rejects.toThrow(BadRequestException);
    });

    it('returns a user if a correct email and password is provided', async () => {
        const user = await authService.signin('test@test.com', 'password');
        expect(user).toBeDefined();
    });
});
