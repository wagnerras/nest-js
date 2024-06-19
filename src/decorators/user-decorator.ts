import { ExecutionContext, NotFoundException, createParamDecorator } from "@nestjs/common";

export const User = createParamDecorator((filter: string, context: ExecutionContext) => {

 const request = context.switchToHttp().getRequest();

 if(request.user) {
  return filter ? request.user[filter] : request.user;
 } else{
  throw new NotFoundException('Usuário não encontado no request. Use o authguard para obter o usuário');
 }

});