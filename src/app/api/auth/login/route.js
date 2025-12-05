import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/user-model';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth-manager';

export async function POST(request) {
    try {
        await connectDB();
        
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { errorMessage: 'Please enter all required fields.' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { errorMessage: 'Wrong email or password provided.' },
                { status: 401 }
            );
        }

        const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
        if (!passwordCorrect) {
            return NextResponse.json(
                { errorMessage: 'Wrong email or password provided.' },
                { status: 401 }
            );
        }

        const token = signToken(user._id);

        const response = NextResponse.json({
            success: true,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        }, { status: 200 });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { errorMessage: 'An error occurred during login.' },
            { status: 500 }
        );
    }
}