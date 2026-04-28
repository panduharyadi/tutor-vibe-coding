import { db } from '../db';
import { users, sessions } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

export class UsersService {
    async loginUser(data: any) {
        // Find user by email
        const [user] = await db.select().from(users).where(eq(users.email, data.email)).limit(1);

        if (!user) {
            throw new Error('Email or Password is not registered');
        }

        // Compare password
        const isPasswordMatch = await bcrypt.compare(data.password, user.password);

        if (!isPasswordMatch) {
            throw new Error('Email or Password is not registered');
        }

        // Generate token
        const token = crypto.randomUUID();

        // Save session
        await db.insert(sessions).values({
            token,
            userId: user.id
        });

        return token;
    }

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
