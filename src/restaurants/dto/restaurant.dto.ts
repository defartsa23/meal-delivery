import { ApiProperty } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime";
import { Expose, Transform, Type } from "class-transformer";
import { IsBoolean, IsBooleanString, IsDate, IsDecimal, IsIn, IsNumber, IsOptional, IsString, Max, Min, MinDate } from "class-validator";

const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();
const currentDate = `${yyyy}-${mm}-${dd}`;

export class RestaurantDto {
    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @MinDate(new Date(currentDate))
    @Expose({ name: 'date' })
    date?: Date;

    @ApiProperty()
    @IsOptional()
    @IsDecimal()
    @Expose({ name: 'latitude' })
    latitude?: Decimal;

    @ApiProperty()
    @IsOptional()
    @IsDecimal()
    @Expose({ name: 'longitude' })
    longitude?: Decimal;

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => value == undefined ? undefined : parseInt(value) )
    @IsNumber()
    @Expose({ name: 'open' })
    @Min(0)
    open?: number;

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => value == undefined ? undefined : parseInt(value) )
    @IsNumber()
    @Expose({ name: 'close' })
    @Min(0)
    close?: number;

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => value == undefined ? undefined : parseInt(value) )
    @IsNumber()
    @Expose({ name: 'minPrice' })
    @Min(0)
    minPrice?: number;

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => value == undefined ? undefined : parseInt(value) )
    @IsNumber()
    @Expose({ name: 'maxPrice' })
    @Min(0)
    maxPrice?: number;

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => value == undefined ? "" : value)
    @IsString()
    @Expose({ name: 'restoOrDishName' })
    restoOrDishName?: string;

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => value == undefined ? "" : value)
    @IsString()
    @Expose({ name: 'dishName' })
    dishName?: string;

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => value == undefined ? 1 : parseInt(value) )
    @IsNumber()
    @Expose({ name: 'page' })
    @Min(1)
    page?: number;

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => value == undefined ? 7 : parseInt(value) )
    @IsNumber()
    @Expose({ name: 'limit' })
    @Max(20)
    limit?: number;
}

export class PopularRestoDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @IsIn(["true", "false"])
    @Expose({ name: 'isByTotalAmount' })
    isByTotalAmount?: string;

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => value == undefined ? 1 : parseInt(value) )
    @IsNumber()
    @Expose({ name: 'page' })
    @Min(1)
    page?: number;

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => value == undefined ? 7 : parseInt(value) )
    @IsNumber()
    @Expose({ name: 'limit' })
    @Max(20)
    limit?: number;
}

export class TransactionRestoDto {
    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => value == undefined ? 1 : parseInt(value) )
    @IsNumber()
    @Expose({ name: 'page' })
    @Min(1)
    page?: number;

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => value == undefined ? 7 : parseInt(value) )
    @IsNumber()
    @Expose({ name: 'limit' })
    @Max(20)
    limit?: number;
}

export class LoginRestoDto {
    @ApiProperty()
    @IsNumber()
    @Min(1)
    id: number;

    @ApiProperty()
    @IsString()
    password: string;
}
