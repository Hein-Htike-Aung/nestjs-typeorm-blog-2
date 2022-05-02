import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "src/user/models/user.interface";
import { UserSecurityService } from './../service/user-security.service';


@Injectable()
export class isCurrentUser implements CanActivate {

    constructor(
        private userSecurityService: UserSecurityService
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const params = request.params;
        const user: User = request.user;

        return this.userSecurityService.findOne(user.id).pipe(
            map((user: User) => {
                let hasPermission = false;

                if (user.id === Number(params.id)) {
                    hasPermission = true;
                }

                return user && hasPermission;
            })
        )
    }


}