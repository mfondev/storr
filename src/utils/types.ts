

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

// Mirrors the Prisma `Category` enum.
type Category = 'ELECTRONICS' | 'HOME' | 'WORK' | 'FOOD' | 'PERSONAL_CARE' | 'OTHER';

// Mirrors the Prisma `Item` model. Dates arrive as ISO strings over JSON, and
// money is integer minor units (`priceCents`), never a float.
type Item = {
    id: string;
    userId: string;
    name: string;
    brand?: string | null;
    category: Category;
    notes?: string | null;

    // purchase info
    priceCents?: number | null;
    currency: string;
    purchaseDate?: string | null;
    store?: string | null;
    quantity: number;

    // perishables
    expiryDate?: string | null;

    // devices
    warrantyExpiresAt?: string | null;
    serialNumber?: string | null;

    // scan / media
    barcode?: string | null;
    imageUrl?: string | null;
    receiptUrl?: string | null;

    // reminders
    remindDaysBefore: number;

    createdAt: string;
    updatedAt: string;
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

export type { LoginInput, RegisterInput, Category, Item, AuthUser, AuthResponse };

