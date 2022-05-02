export interface User {
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    profileImage?: string;
}

export enum UserRole {
    ADMIN = 'ADMIN',
    CHIEFEDITOR = 'CHIEFEDITOR',
    EDITOR = 'EDITOR',
    USER = 'USER'
}