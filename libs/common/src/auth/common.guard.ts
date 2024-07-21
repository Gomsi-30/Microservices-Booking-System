import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AUTH_SERVICE } from "../constants";
import { Observable, map, tap, catchError } from "rxjs";
import { UsersDto } from "apps/auth/src/users/dto/users.dto";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class CommonGuard implements CanActivate {
    constructor(@Inject(AUTH_SERVICE) private readonly authService: ClientProxy) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const jwt = context.switchToHttp().getRequest().cookies?.Authentication;
        if (!jwt) {
            console.log('JWT token missing');
            return false;
        }
        return this.authService.send<UsersDto>('authenticate', {
            Authentication: jwt
        })
        .pipe(
            tap((res) => {
                console.log('User authenticated', res);
                context.switchToHttp().getRequest().user = res;
            }),
            map(() => true),
            catchError(err => {
                console.log('Authentication failed', err);
                throw new RpcException('Forbidden resource');
            })
        );
    }
}
