import { IsString } from 'class-validator';

export class MessageDeleteDto {
  @IsString()
  id!: string;
}
