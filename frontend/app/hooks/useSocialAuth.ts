import { useGoogleLogin } from '@react-oauth/google';
import { appleAuthHelpers } from 'react-apple-signin-auth';
import { useUserContext } from '~/hooks/useUserContext';

/**
 * Ensures the Apple Sign-In SDK is loaded onto the document.
 */
const ensureAppleScript = () => {
    if ((window as any).AppleID) return Promise.resolve();
    
    return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
        script.async = true;
        script.onload = () => {
            console.log("Nexus Security: Apple SDK loaded successfully.");
            resolve();
        };
        script.onerror = () => {
            console.error("Nexus Security: Failed to load Apple SDK.");
            reject(new Error("Apple SDK load failure"));
        };
        document.head.appendChild(script);
    });
};

export const useSocialAuth = () => {
    const { loginWithGoogle: contextGoogleLogin, loginWithApple: contextAppleLogin } = useUserContext();

    // 1. Google Setup
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                await contextGoogleLogin(tokenResponse.access_token);
            } catch (err) {
                // error is handled in the zustand context store and automatically displayed to user
            }
        },
        onError: () => console.error('Google Handshake Failed'),
    });

    // 2. Apple Setup
    // 2. Apple Setup
    const handleAppleLogin = async () => {
        console.log("Nexus Security: Initializing Apple Handshake...");
        
        try {
            // Ensure script is present before attempting sign-in
            await ensureAppleScript();

            const res: any = await appleAuthHelpers.signIn({
                authOptions: {
                    clientId: 'com.nexus.app', // Matched with backend settings
                    scope: 'email name',
                    redirectURI: window.location.origin + '/auth/callback',
                    usePopup: true,
                },
            });
            
            if (res?.authorization?.id_token) {
                console.log("Nexus Identity: Apple Handshake Success.");
                await contextAppleLogin(
                    res.authorization.id_token,
                    res.authorization.code
                );
            } else {
                console.warn("Nexus Security: Apple Handshake returned no token.");
            }
        } catch (err: any) {
            console.error("Nexus Security: Apple Handshake Critical Failure:", err);
            // error is handled in the zustand store
        }
    };

    return { 
        loginWithGoogle: googleLogin,
        loginWithApple: handleAppleLogin 
    };
};