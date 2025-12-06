import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/user-model';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth-manager';

export async function POST(request) {
    try {
        await connectDB();
        
        const body = await request.json();
        const { userName, email, password, passwordVerify, avatar } = body;

        if (!userName || !email || !password || !passwordVerify || !avatar) {
            return NextResponse.json(
                { errorMessage: 'Please enter all required fields and select an avatar.' },
                { status: 400 }
            );
        }

        if (userName.trim().length === 0) {
            return NextResponse.json(
                { errorMessage: 'User name cannot be empty or only whitespace.' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { errorMessage: 'Please enter a valid email address.' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { errorMessage: 'Password must be at least 8 characters long.' },
                { status: 400 }
            );
        }

        if (password !== passwordVerify) {
            return NextResponse.json(
                { errorMessage: 'Passwords do not match.' },
                { status: 400 }
            );
        }

        if (!avatar.startsWith('data:image/')) {
            return NextResponse.json(
                { errorMessage: 'Invalid avatar format. Please select a valid image.' },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return NextResponse.json(
                { errorMessage: 'An account with this email address already exists.' },
                { status: 400 }
            );
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            userName: userName.trim(),
            email: email.toLowerCase().trim(),
            passwordHash,
            avatar
        });

        const savedUser = await newUser.save();

        const token = signToken(savedUser._id);

        const response = NextResponse.json({
            success: true,
            user: {
                userName: savedUser.userName,
                email: savedUser.email,
                avatar: savedUser.avatar
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
        console.error('Registration error:', error);
        
        if (error.code === 11000) {
            return NextResponse.json(
                { errorMessage: 'An account with this email already exists.' },
                { status: 400 }
            );
        }
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return NextResponse.json(
                { errorMessage: `Validation failed: ${messages.join(', ')}` },
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            { errorMessage: 'An error occurred during registration. Please try again.' },
            { status: 500 }
        );
    }
}