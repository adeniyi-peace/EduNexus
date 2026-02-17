/**
 * Mocking the connection between React Router (Frontend) 
 * and your Django Backend.
 */

export interface User {
    id: string;
    email: string;
    role: "ADMIN" | "STUDENT" | "INSTRUCTOR";
    fullName: string;
}

export interface SystemStatus {
    maintenance: boolean;
    estimatedReturn?: string;
}

export async function getUser(request: Request): Promise<User | null> {
    // In production: You'd parse the 'Authorization' header or a JWT cookie
    // and potentially verify it with your Django 'api/auth/verify' endpoint.
    
    // Mocking an Admin for testing
    return {
        id: "usr_123",
        email: "admin@edunexus.com",
        role: "ADMIN",
        fullName: "System Admin"
    };
}

export async function getSystemStatus(): Promise<SystemStatus> {
    // In production: fetch(`${process.env.DJANGO_URL}/api/system/status/`)
    
    return {
        maintenance: true, // Change to true to test your maintenance page
        estimatedReturn: "2026-02-17T14:00:00Z"
    };
}