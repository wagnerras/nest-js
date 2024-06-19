import { Module } from "@nestjs/common";
import { PrismaService } from "./primsa.service";

@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule { }