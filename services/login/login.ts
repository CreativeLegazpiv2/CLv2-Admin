import { supabase } from '@/services/supabaseClient';
import bcrypt from 'bcryptjs';
import { createJWT, verifyJWT } from './jwt'; // Import createJWT and verifyJWT

export const loginUser = async (username: string, password: string) => {
    console.log("Attempting login with:", { username });

    // Step 1: Get user data from the 'admin' table
    const { data: userData, error: userError } = await supabase
        .from("admin")
        .select("id, username, password")
        .eq("username", username)
        .single();

    if (userError || !userData) {
        console.log("Login failed: User not found", userError);
        throw new Error("Invalid username or password");
    }

    // Step 2: Check if the password matches
    const isPasswordMatch = await bcrypt.compare(password, userData.password);
    if (!isPasswordMatch) {
        console.log("Login failed: Incorrect password");
        throw new Error("Invalid username or password");
    }

    // Step 3: Create JWT upon successful login
    const token = await createJWT({ id: userData.id, username: userData.username });
    console.log("Login successful:", { id: userData.id, username: userData.username, token });

    // Decrypt and log the token payload
    try {
        const decryptedPayload = await verifyJWT(token); // Use the verifyJWT function to get the payload
        console.log('Decrypted Payload after Login:', decryptedPayload);
    } catch (error) {
        console.error('Failed to decrypt token:', error);
    }

    return { id: userData.id, username: userData.username, token };
};
