import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { from, map, Observable, switchMap } from 'rxjs';
import { User } from '../models/user.interface';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
  ) { }

  findOne(id: number): Observable<User> {
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      map((user: User) => {
        const { password, ...result } = user;
        return result;
      })
    );
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users: User[]) => {
        users.forEach(u => delete u.password);
        return users;
      })
    );
  }

  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  updateOne(id: number, user: User): Observable<any> {
    delete user.email;
    delete user.password;
    delete user.role;

    return from(this.userRepository.update(id, user)).pipe(
      switchMap(() => this.findOne(id))
    );
  }

  updateRoleOfUser(id: number, user: User): Observable<any> {
    delete user.email;
    delete user.password;
    delete user.username;

    return from(this.userRepository.update(id, user));
  }

  findByMail(email: string): Observable<User> {
    return from(this.userRepository.findOne({ where: { email } }));
  }

  paginate(options: IPaginationOptions): Observable<Pagination<User>> {
    return from(paginate<User>(this.userRepository, options)).pipe(
      map((usersPageable: Pagination<User>) => {
        usersPageable.items.forEach(function (v) { delete v.password });
        return usersPageable;
      })
    )
  }

  paginateFilterByUsername(options: IPaginationOptions, user: User): Observable<Pagination<User>> {
    return from(this.userRepository.findAndCount({
      skip: +options.page * +options.limit || 0,
      take: +options.limit || 10,
      order: { id: "ASC" },
      select: ['id', 'name', 'username', 'email', 'role'],
      where: [
        { username: Like(`%${user.username}%`) }
      ]
    })).pipe(
      map(([users, totalUsers]) => {
        const usersPageable: Pagination<User> = {
          items: users,
          links: {
            first: options.route + `?limit=${options.limit}`,
            previous: options.route + ``,
            next: options.route + `?limit=${options.limit}&page=${+options.page + 1}`,
            last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalUsers / +options.limit)}`
          },
          meta: {
            currentPage: +options.page,
            itemCount: users.length,
            itemsPerPage: +options.limit,
            totalItems: totalUsers,
            totalPages: Math.ceil(totalUsers / +options.limit)
          }
        };
        return usersPageable;
      })
    )
  }
}
