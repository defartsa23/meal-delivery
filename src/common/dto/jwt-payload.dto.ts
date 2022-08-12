import { Decimal } from "@prisma/client/runtime";

export class JwtPayloadDto {
    id: number;
    name: string;
    role: string;
    latitude: Decimal;
    longitude: Decimal;
    
    // default of jwt payload
    iat?: number;
    exp?: number;
    iss?: string;
  }
  