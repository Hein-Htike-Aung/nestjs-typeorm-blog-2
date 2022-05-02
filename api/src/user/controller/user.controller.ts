import { isCurrentUser } from './../../auth/guards/is-current-user.guard';
import { UserSecurityService } from './../../auth/service/user-security.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, Request, UploadedFile, Res } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User, UserRole } from '../models/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Pagination } from 'nestjs-typeorm-paginate';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { hasRoles } from '../../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import path = require('path');

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req, file, cb) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`)
    }
  })
}

@Controller('users')
export class UserController {


  constructor(private userService: UserService, private userSecurityService: UserSecurityService) { }

  @Post()
  create(@Body() user: User): Observable<User | Object> {
    return this.userSecurityService.create(user).pipe(
      map((user: User) => user),
      catchError(err => of({ error: err.message }))
    );
  }

  @Post('login')
  login(@Body() user: User): Observable<Object> {
    return this.userSecurityService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      })
    )
  }

  @Get(':id')
  findOne(@Param() params): Observable<User> {
    return this.userService.findOne(params.id);
  }

  @Get()
  index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('username') username: string
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;

    if (!username) {
      return this.userService.paginate({ page: Number(page), limit: Number(limit), route: 'http://localhost:3000/users' });
    } else {
      return this.userService.paginateFilterByUsername(
        { page: Number(page), limit: Number(limit), route: 'http://localhost:3000/users' },
        { username }
      )
    }
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<any> {
    return this.userService.deleteOne(Number(id));
  }

  @UseGuards(JwtAuthGuard, isCurrentUser)
  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.userService.updateOne(Number(id), user);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/role')
  updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User> {
    return this.userService.updateRoleOfUser(Number(id), user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Observable<Object> {
    const user: User = req.user;

    return this.userService.updateOne(user.id, { profileImage: file.filename }).pipe(
      map((user: User) => ({ profileImage: user.profileImage }))
    )
  }

  @Get('profile-image/:imagename')
  findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
    return of(res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename)));
  }

}
