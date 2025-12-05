import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/user-model';
import { verifyUser } from '@/lib/auth-manager';

export async function GET(request) {
    try {
        await connectDB();
        
        const userId = verifyUser(request);
        
        if (!userId) {
            return NextResponse.json({
                loggedIn: false,
                user: null
            }, { status: 200 });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return NextResponse.json({
                loggedIn: false,
                user: null
            }, { status: 200 });
        }

        return NextResponse.json({
            loggedIn: true,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        }, { status: 200 });

    } catch (error) {
        console.error('GetLoggedIn error:', error);
        return NextResponse.json(
            { loggedIn: false, user: null, errorMessage: 'An error occurred.' },
            { status: 401 }
        );
    }
}