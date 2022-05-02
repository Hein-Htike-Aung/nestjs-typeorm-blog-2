import { from, Observable } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { User } from '../../user/models/user.interface';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }

    comparePasswords(password: string, hashPassword: string): Observable<any> {
        return from(bcrypt.compare(password, hashPassword));
    }

    hashPassword(password: string): Observable<string> {
        return from<string>(bcrypt.hash(password, 12));
    }

    generateJwtToken(user: User): Observable<string> {
        return from(this.jwtService.signAsync({ user }));
    }
}
