

type LoginInput = {
    email: string;
    password: string;
}

type RegisterInput = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

type Item = {
    id: string;
    name: string;
    description: string;
    category: string;
    purchaseDate: string;
    warrantyEndDate: string;
    imageUrl: string;
}

type AuthUser = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

// Shape the backend returns from /auth/login and /auth/register.
type AuthResponse = {
    status: string;
    message: string;
    data: {
        user: AuthUser;
        token: string;
    };
}

export type {  LoginInput, RegisterInput, Item, AuthUser, AuthResponse };

