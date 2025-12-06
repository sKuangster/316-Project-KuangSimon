import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/user-model';
import bcrypt from 'bcryptjs';
import { verifyUser } from '@/lib/auth-manager';

export async function PUT(request) {
    try {
        await connectDB();
        
        const userId = verifyUser(request);
        if (!userId) {
            return NextResponse.json(
                { errorMessage: 'You must be logged in to edit your account.' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { userName, avatar, password, passwordVerify } = body;

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { errorMessage: 'User not found.' },
                { status: 404 }
            );
        }

        if (!userName || userName.trim().length === 0) {
            return NextResponse.json(
                { errorMessage: 'User name cannot be empty or only whitespace.' },
                { status: 400 }
            );
        }

        if (!avatar || !avatar.startsWith('data:image/')) {
            return NextResponse.json(
                { errorMessage: 'Invalid avatar format. Please select a valid image.' },
                { status: 400 }
            );
        }

        const updateData = {
            userName: userName.trim(),
            avatar: avatar
        };

        if (password && password.length > 0) {
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

            const saltRounds = 10;
            updateData.passwordHash = await bcrypt.hash(password, saltRounds);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Account updated successfully.',
            user: {
                userName: updatedUser.userName,
                email: updatedUser.email,
                avatar: updatedUser.avatar
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Edit account error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return NextResponse.json(
                { errorMessage: `Validation failed: ${messages.join(', ')}` },
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            { errorMessage: 'An error occurred while updating your account.' },
            { status: 500 }
        );
    }
}