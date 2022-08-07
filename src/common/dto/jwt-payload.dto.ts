export class JwtPayloadDto {
    id: number;
    name: string;
    
    // default of jwt payload
    iat?: number;
    exp?: number;
    iss?: string;
  }
  