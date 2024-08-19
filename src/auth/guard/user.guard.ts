import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtUserGuard extends AuthGuard('jwt') {
    // Override handleRequest so it never throws an error
    handleRequest(err, user) {
        return user;
    }
    // handleRequest(err, user, info, context) {
    //     return user;
    // }
}