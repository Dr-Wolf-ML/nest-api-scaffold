import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    createTypeOrmOptions():
        | TypeOrmModuleOptions
        | Promise<TypeOrmModuleOptions> {
        if (process.env.NODE_ENV === 'development') {
            return {
                type: this.configService.get<any>('DB_TYPE'),
                database: this.configService.get<string>('DB_NAME'),
                synchronize: this.configService.get<boolean>('DB_SYNC'),
                autoLoadEntities: true,
                migrationsRun: this.configService.get<boolean>(
                    'DB_MIGRATIONS_RUN'
                ),
                keepConnectionAlive: this.configService.get<boolean>(
                    'KEEP_CONNECTION_ALIVE'
                ),
            };
        }

        if (process.env.NODE_ENV === 'test') {
            return {
                type: this.configService.get<any>('DB_TYPE'),
                database: this.configService.get<string>('DB_NAME'),
                synchronize: this.configService.get<boolean>('DB_SYNC'),
                autoLoadEntities: true,
                migrationsRun: this.configService.get<boolean>(
                    'DB_MIGRATIONS_RUN'
                ),
                keepConnectionAlive: this.configService.get<boolean>(
                    'KEEP_CONNECTION_ALIVE'
                ),
                // type: 'sqlite',
                // synchronize: process.env.NODE_ENV === 'test' ? true : false,
                // database: this.configService.get<string>('DB_NAME'),
                // autoLoadEntities: true,
                // migrationsRun: process.env.NODE_ENV === 'test' ? true : false,
                // keepConnectionAlive:
                //     process.env.NODE_ENV === 'test' ? true : false,
            };
        }

        if (process.env.NODE_ENV === 'production') {
            return {
                type: this.configService.get<any>('DB_TYPE'),

                database: this.configService.get<string>('DB_NAME'),
                synchronize: this.configService.get<boolean>('DB_SYNC'),
                autoLoadEntities: true,
                migrationsRun: this.configService.get<boolean>(
                    'DB_MIGRATIONS_RUN'
                ),
                ssl: {
                    rejectUnauthorized: this.configService.get<boolean>(
                        'REJECT_UNAUTHORIZED'
                    ),
                },
            };
        }
    }
}

//? Legacy:
// type: 'sqlite',
// synchronize: process.env.NODE_ENV === 'test' ? true : false,
// database: this.configService.get<string>('DB_NAME'),
// autoLoadEntities: true,
// migrationsRun: process.env.NODE_ENV === 'test' ? true : false,
// keepConnectionAlive: process.env.NODE_ENV === 'test' ? true : false,
