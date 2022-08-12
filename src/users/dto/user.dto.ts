import { Expose, Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDate, IsNumber, IsOptional, IsString, Max, Min, min, ValidateNested } from "class-validator";

export class UserDto {
    @IsOptional()
    @Transform(({ value }) => value == undefined ? 1 : parseInt(value) )
    @IsNumber()
    @Expose({ name: 'page' })
    @Min(1)
    page?: number;
    
    @IsOptional()
    @Transform(({ value }) => value == undefined ? 3 : parseInt(value) )
    @IsNumber()
    @Expose({ name: 'limit' })
    @Max(20)
    limit?: number;
}

export class countTransaction {
    @IsDate()
    @Type(() => Date)
    @Expose({ name: 'fromDate' })
    fromDate: Date;

    @IsDate()
    @Type(() => Date)
    @Expose({ name: 'endDate' })
    endDate: Date;

    @Transform(({ value }) =>  parseInt(value) )
    @IsNumber()
    @Expose({ name: 'limit' })
    limit: number;
}

export class LoginDto {
    @IsNumber()
    @Min(1)
    id: number;

    @IsString()
    password: string;
}

class listMenu {
    @IsNumber()
    @Min(1)
    menuId: number;

    @IsNumber()
    @Min(1)
    price: number;

    @IsNumber()
    @Min(1)
    total: number;
}

export class OrderDto {
    @IsNumber()
    @Min(1)
    restaurantId: number;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ always: true })
    @Type(() => listMenu)
    listMenu: listMenu[];
}