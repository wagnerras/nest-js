import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { UserDTO } from "./dto/user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UserService } from "./user.service";
import { ParamId } from "src/decorators/param-id.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { RoleGuard } from "src/guards/role.guard";
import { AuthGuard } from "src/guards/auth.guard";

//import { LogInterceptor } from "src/interceptors/log.interceptor";

//@UseInterceptors(LogInterceptor)
@UseGuards(AuthGuard, RoleGuard)
//@Roles(Role.Admin)
@Controller('users')
export class UserController {

  constructor(private userService: UserService) { }

  @Roles(Role.Admin)
  @Post()
  //@HttpCode(200)
  async create(@Body() body: UserDTO): Promise<UserDTO> {
    return await this.userService.create(body);
  }

  @Get()
  async getAll(): Promise<UserDTO[]> {
    return await this.userService.getAll();
  }

  /* @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserDTO> {
    return await this.userService.getUser(id);
  }
 */

  @Get(':id')
  async getUser(@ParamId() id: number): Promise<UserDTO> {
    console.log({ id });
    return await this.userService.getUser(id);
  }
  @Roles(Role.Admin)
  @Patch(':id')
  async update(@Body() body: UpdateUserDTO, @Param('id', ParseIntPipe) id: number) {
    return await this.userService.update(id, body);
  }

  /* @Put(':id')
  async update2(@Body() body: UserDTO, @Param('id', ParseIntPipe) id: number) {
    return { id };
  } */

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id): Promise<UserDTO> {
    return await this.userService.delete(id);
  }

}