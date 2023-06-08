import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto'; // scrypt is asynchronous and makes use of a callback function
import { promisify } from 'util'; // promisify takes a callback function and returns a promise

import { UsersService } from './users.service';

const scrypt = promisify(_scrypt); // promisify takes a callback function and returns a promise

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    // Called from UsersController
    async signup(email: string, password: string) {
        // See if email is in use
        const users = await this.userService.find(email);

        // If email is in use, throw an error
        if (users.length) {
            throw new BadRequestException('email in use');
        }

        // If email is not in use, hash the password
        // Generate a salt
        const salt = randomBytes(8).toString('hex');

        // Hash the password with the salt
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Join the hashed password and the salt
        const result = salt + '.' + hash.toString('hex');

        // Create a new user and save it
        const user = await this.userService.create(email, result);

        // Return the user
        return user;
    }

    async signin(suppliedEmail: string, suppliedPassword: string) {
        const [user] = await this.userService.find(suppliedEmail);

        if (!user) {
            throw new NotFoundException('user not found');
        }

        const [storedSalt, storedHash] = user.password.split('.');

        const calculatedHash = (await scrypt(
            suppliedPassword,
            storedSalt,
            32
        )) as Buffer;

        if (storedHash !== calculatedHash.toString('hex')) {
            throw new BadRequestException('bad password');
        }

        return user;
    }
}
