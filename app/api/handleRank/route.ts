import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

// This will handle POST requests
export async function POST(req: Request) {
    return await updateOrAdd(req);
}

async function updateOrAdd(req: Request) {
    try {
        const { userId, newRank } = await req.json();

        // Validate rank
        if (newRank < 0 || newRank > 10) {
            return NextResponse.json({ error: 'Rank must be between 0 and 10.' }, { status: 400 });
        }

        if(newRank == 0){
                  const { error: updateError } = await supabase
                .from('userDetails')
                .update({ rank: null })
                .eq('detailsid', userId);

            if (updateError) {
                throw new Error(updateError.message);
            }

            return NextResponse.json({ message: 'Rank updated successfully.' }, { status: 200 });
        }
        // Check if the rank is already taken by other users
        const { data: existingUsers, error: fetchError } = await supabase
            .from('userDetails')
            .select('detailsid')
            .eq('rank', newRank);

        if (fetchError) {
            throw new Error(fetchError.message);
        }

        // If the new rank is taken by another user
        if (existingUsers.length > 0) {
            // Check if the user already exists
            const { data: currentUser, error: currentUserError } = await supabase
                .from('userDetails')
                .select('rank')
                .eq('detailsid', userId)
                .single();

            if (currentUserError && currentUserError.code !== 'PGRST116') {
                throw new Error(currentUserError.message); // Handle error if user not found
            }

            // If the user exists and the rank is already taken by another user
            if (currentUser && currentUser.rank !== newRank) {
                return NextResponse.json({ error: 'Rank must be unique.' }, { status: 400 });
            }

            // If the user does not exist, insert a new user with the given rank
            if (!currentUser) {
                const { error: insertError } = await supabase
                    .from('userDetails')
                    .insert([{ detailsid: userId, rank: newRank }]);

                if (insertError) {
                    throw new Error(insertError.message);
                }

                return NextResponse.json({ message: 'User added with rank successfully.' }, { status: 201 });
            }
        } else {
            // Update the user's rank if it is unique
            const { error: updateError } = await supabase
                .from('userDetails')
                .update({ rank: newRank })
                .eq('detailsid', userId);

            if (updateError) {
                throw new Error(updateError.message);
            }

            return NextResponse.json({ message: 'Rank updated successfully.' }, { status: 200 });
        }

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
