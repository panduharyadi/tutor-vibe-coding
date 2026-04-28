import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

export class UsersService {
    async registerUser(data: any) {
        // Check if email already exists
        const existingUser = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
        
        if (existingUser.length > 0) {
            throw new Error('Email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Insert user
        const result = await db.insert(users).values({
            ...data,
            password: hashedPassword
        });

        // Get created user (without password)
        const newUser = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt
        }).from(users).where(eq(users.email, data.email)).limit(1);

        return newUser[0];
    }
}
