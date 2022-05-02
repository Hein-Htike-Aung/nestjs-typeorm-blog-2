export interface LoginPayload {
    email: string;
    password: string;
}

export interface _User {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: string;
    profileImage?: string;
}

export interface UserData {
    items: _User[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totlaPages: number;
        currentPage: number;
    },
    links: {
        first: string;
        previous: string;
        next: string;
        last: string;
    }
}