import { Elysia, t } from 'elysia';
import { UsersService } from '../services/users-services';

const usersService = new UsersService();

export const userRoutes = new Elysia()
    .post('/users', async ({ body, set }) => {
        try {
            const newUser = await usersService.registerUser(body);
            
            return {
                status: 'success',
                message: 'User created successfully',
                data: newUser
            };
        } catch (error: any) {
            if (error.message === 'Email already exists') {
                set.status = 400;
                return {
                    status: 'error',
                    message: 'Email already exists',
                    data: null
                };
            }
            
            set.status = 500;
            return {
                status: 'error',
                message: 'Internal server error',
                data: null
            };
        }
    }, {
        body: t.Object({
            name: t.String(),
            email: t.String({ format: 'email' }),
            password: t.String()
        })
    })
    .post('/login', async ({ body, set }) => {
        try {
            const token = await usersService.loginUser(body);
            
            return {
                status: 'success',
                message: 'Login has been successfully',
                data: token
            };
        } catch (error: any) {
            if (error.message === 'Email or Password is not registered') {
                set.status = 400;
                return {
                    status: 'error',
                    message: 'Email or Password is not registered',
                    data: null
                };
            }
            
            set.status = 500;
            return {
                status: 'error',
                message: 'Internal server error',
                data: null
            };
        }
    }, {
        body: t.Object({
            email: t.String({ format: 'email' }),
            password: t.String()
        })
    });
