import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { appleAuthHelpers } from 'react-apple-signin-auth';

export const useSocialAuth = () => {
    // This MUST be inside the function body
    const googleLogin = useGoogleLogin({
        // This is the "Encrypted Handshake"
        onSuccess: async (tokenResponse) => {
            try {
                const response = await axios.post('/api/auth/google/', {
                    access_token: tokenResponse.access_token 
                });
                // Store tokens in localStorage and update your Auth Context
                console.log("Nexus Identity Initialized:", response.data);
                // Handle success (save tokens, redirect, etc.)
            } catch (err) {
                console.error("Google Handshake Failed", err);
            }
        },
        onError: () => console.log('Google Handshake Failed'),
    });

    const loginWithApple = async () => {
        try {
            const res = await appleAuthHelpers.signIn({
                authOptions: {
                    clientId: 'com.nexus.service.id',
                    scope: 'email name',
                    redirectURI: window.location.origin + '/auth/callback',
                    usePopup: true,
                },
            });
            
            // Send res.authorization.id_token to your backend here
        } catch (err) {
            console.error("Apple Handshake Failed", err);
        }
    };

    return { 
        loginWithGoogle: googleLogin, // Return the trigger function
        loginWithApple 
    };
};