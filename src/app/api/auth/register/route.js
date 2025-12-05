import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/user-model';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth-manager';

export async function POST(request) {
    try {
        await connectDB();
        
        const { firstName, lastName, email, password, passwordVerify } = await request.json();

        // Validation
        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            return NextResponse.json(
                { errorMessage: 'Please enter all required fields.' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { errorMessage: 'Please enter a password of at least 8 characters.' },
                { status: 400 }
            );
        }

        if (password !== passwordVerify) {
            return NextResponse.json(
                { errorMessage: 'Please enter the same password twice.' },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { errorMessage: 'An account with this email address already exists.' },
                { status: 400 }
            );
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = new User({
            firstName,
            lastName,
            email,
            passwordHash
        });

        const savedUser = await newUser.save();

        // Sign token
        const token = signToken(savedUser._id);

        // Create response with cookie
        const response = NextResponse.json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email
            }
        }, { status: 200 });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;

    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { errorMessage: 'An error occurred during registration.' },
            { status: 500 }
        );
    }
}