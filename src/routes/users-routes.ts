import { Elysia, t } from 'elysia';
import { UsersService } from '../services/users-services';

const usersService = new UsersService();

export const userRoutes = new Elysia({ prefix: '/users' })
    .post('/', async ({ body, set }) => {
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
    });
