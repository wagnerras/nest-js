import { NestMiddleware, BadRequestException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class UserIdCheckMiddleware implements NestMiddleware {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  use(req: Request, res: Response, next: NextFunction) {
    console.log('chamou o middleware');

    if(isNaN(Number(req.params.id)) || Number(req.params.id) < 1) {
      throw new BadRequestException('ID inválido!')
    }

    next();
  }

}