import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor (private readonly jwtService: JwtService){}
  async canActivate(
    context: ExecutionContext,
  ) {
    

    const request = context.switchToHttp().getRequest();

    const accessTokem = request.headers.authorization?.split(' ')[1];

    if(!accessTokem){
      throw new UnauthorizedException("Login Again");
    }

    try{
      const payload = await this.jwtService.verify(accessTokem);
      console.log(payload);
      request.userId = payload.id;
    } catch(err)
    {
      throw new UnauthorizedException();
    }
    return true;
  }
}
