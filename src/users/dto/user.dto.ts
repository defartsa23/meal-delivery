import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDate, IsNumber, IsOptional, IsString, Max, Min, min, ValidateNested } from "class-validator";

export class UserDto {
    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => value == undefined ? 1 : parseInt(value) )
    @IsNumber()
    @Expose({ name: 'page' })
    @Min(1)
    page?: number;
    
    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => value == undefined ? 3 : parseInt(value) )
    @IsNumber()
    @Expose({ name: 'limit' })
    @Max(20)
    limit?: number;
}

export class countTransaction {
    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    @Expose({ name: 'fromDate' })
    fromDate: Date;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    @Expose({ name: 'endDate' })
    endDate: Date;

    @ApiProperty()
    @Transform(({ value }) =>  parseInt(value) )
    @IsNumber()
    @Expose({ name: 'limit' })
    limit: number;
}

export class LoginDto {
    @ApiProperty({type:Number})
    @IsNumber()
    @Min(1)
    id: number;

    @ApiProperty({type:String})
    @IsString()
    password: string;
}

class listMenu {
    @ApiProperty()
    @IsNumber()
    @Min(1)
    menuId: number;

    @ApiProperty()
    @IsNumber()
    @Min(1)
    price: number;

    @ApiProperty()
    @IsNumber()
    @Min(1)
    total: number;
}

export class OrderDto {
    @ApiProperty()
    @IsNumber()
    @Min(1)
    restaurantId: number;

    @ApiProperty({ type: () => [listMenu] })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ always: true })
    @Type(() => listMenu)
    listMenu: listMenu[];
}