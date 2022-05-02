import { UserEntity } from './../../user/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { Injectable } from "@nestjs/common";
import { Repository } from 'typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { User, UserRole } from '../../user/models/user.interface';

@Injectable()
export class UserSecurityService {

    constructor(
        private authService: AuthService,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
    ) { }

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOne({ where: { id } })).pipe(
            map((user: User) => {
                const { password, ...result } = user;
                return result;
            })
        )
    }

    validateUser(email: string, password: string): Observable<User> {
        return from(
            this.userRepository.findOne({ where: { email }, select: ['id', 'password', 'name', 'username', 'email', 'role', 'profileImage'] })).pipe(
                switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
                    map((match: boolean) => {
                        if (match) {
                            const { password, ...result } = user;
                            return result;
                        } else {
                            throw Error;
                        }
                    })
                )),
            )
    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                if (user) {
                    return this.authService.generateJwtToken(user).pipe(map((jwt: string) => jwt));
                } else {
                    return 'Wrong Credentials';
                }
            })
        )
    }


    create(user: User): Observable<User> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passwordHash;
                newUser.role = UserRole.USER;
                // newUser.role = user.role;

                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const { password, ...result } = user;
                        return result;
                    }),
                    catchError(err => throwError(() => err))
                )
            })
        )
    }


}