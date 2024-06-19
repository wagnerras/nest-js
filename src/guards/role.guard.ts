import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private reflector: Reflector) { }

  async canActivate(context: ExecutionContext) {
    const requeridRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    console.log('requeridRoles ->', requeridRoles);

    if (!requeridRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('user ->', user);

    const rolesFiltered = requeridRoles.filter(role => role === user.role);

    return rolesFiltered.length > 0;
  }

}