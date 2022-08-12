import { 
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    Logger
} from '@nestjs/common';
import { Restaurants } from '@prisma/client';
import { getDayName } from 'src/common/helpers/dateDayName.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RestaurantDto } from './dto/restaurant.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from 'src/common/dto/jwt-payload.dto';
import { json } from 'stream/consumers';

@Injectable()
export class RestaurantsService {
    private readonly logger: Logger = new Logger(RestaurantsService.name);

    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService
    ) {}

    async getRestaurant(user, params:RestaurantDto) {
        try {            
            const latitude = user == false ? params.latitude : parseFloat(user.latitude);
            const longitude = user == false ? params.longitude : parseFloat(user.longitude);
            
            const skip = (params.page - 1) * params.limit;

            let select = 'SELECT r.id, r.name, r.latitude , r.longitude';
            let where = `WHERE r.name LIKE "%${params.restoOrDishName}%" `;
            let order = 'ORDER BY';
            let whereHour = '';
            let whereMenu = ` AND m.name LIKE "%${params.restoOrDishName}%"  `;
            
            if (latitude && longitude) {
                select += `, Distance(${latitude}, ${longitude}, r.latitude , r.longitude) as distance`;
                where += `  AND Distance(${latitude}, ${longitude}, r.latitude , r.longitude) <= 5`;
                order += ` distance ASC`;
            }
            
            if (params.open != undefined && params.close != undefined) {
                whereHour += ` AND h.open >= ${params.open} AND ${params.close} <= h.closeFilter `
            }

            if (params.minPrice != undefined && params.maxPrice != undefined) {
                whereMenu += `  AND m.price BETWEEN ${params.minPrice} AND ${params.maxPrice}  `
            }

            if (params.date) {
                const dayName = getDayName(params.date);
                whereHour += ` AND h.day = '${dayName}' `
            }

            if (params.dishName != "") {
                whereMenu += ` AND m.name = "${params.dishName}" `
            }

            order = order === 'ORDER BY' ? '' : order;

            const query = select + 
            ' FROM Restaurants r' + 
            ' INNER JOIN Hours h ON h.restaurantId = r.id ' + whereHour +
            ' INNER JOIN Menus m ON m.restaurantId = r.id ' + whereMenu +
            where + ' ' +
            ' GROUP BY r.id ' +
            order +
            ' LIMIT ?, ?;';

            const resto = await this.prisma.$queryRawUnsafe<Restaurants[]>(query,
                skip, 
                params.limit
            )

            return {
                status: 'success',
                message: `Success get data.`,
                data : resto
            };
        } catch (error) {
            this.logger.error(error.message);
            const statusCode = error.status === undefined ? HttpStatus.INTERNAL_SERVER_ERROR : error.status;
            throw new HttpException({
                statusCode: statusCode,
                message: error.message
            }, statusCode);
        }
    }

    async login(body:LoginDto) {
        try {
            const { id, password } = body;

            const user:Restaurants = await this.prisma.restaurants.findUnique({
                where: {
                    id: id
                }
            });

            if (!user) {
                return {
                  status: 'failed',
                  message: 'Data not found',
                }
            }

            const isPassMatch = await bcrypt.compare(
                password,
                user.password,
              );

            if (!isPassMatch) {
                throw new BadRequestException({
                    status: 'failed',
                    message: 'Password not match',
                });
            } 
            const payload:JwtPayloadDto = {
                id: user.id,
                name: user.name,
                role: 'resto',
                latitude: user.latitude,
                longitude: user.longitude
            }

            const token = this.jwtService.sign(payload)

            return {
                status: 'success',
                message: `User ${user.name} sussess login.`,
                token
            };
        } catch (error) {
            this.logger.error(error.message);
            const statusCode = error.status === undefined ? HttpStatus.INTERNAL_SERVER_ERROR : error.status;
            throw new HttpException({
                statusCode: statusCode,
                message: error.message
            }, statusCode);
        }
    }

    async popular(params:RestaurantDto) {
        try {
            const limit = params.limit * 1;
            const skip = (params.page - 1) * params.limit;
            const order = (params.isByTotalAmount === "true") ? 'sumTransaction' : 'countTransaction';
            
            const query = 'SELECT ' +
                    'r.id, ' +
                    'r.name, ' +
                    'r.latitude, ' +
                    'r.longitude, ' +
                    'COUNT(o.menuId) countTransaction, ' +
                    'SUM(o.amount) sumTransaction ' +
                'FROM Restaurants r  ' + 
                'INNER JOIN Menus m ON m.restaurantId = r.id  ' + 
                'INNER JOIN Orders o ON o.menuId = m.id ' + 
                'GROUP BY r.id ' + 
                `ORDER BY ${order} DESC ` +
                'LIMIT ?, ?;'; 

            let data = await this.prisma.$queryRawUnsafe(
                query,
                skip,
                limit
            );

            const temps:string = JSON.stringify(
                data,
                (key, value) => (typeof value === 'bigint' ? value.toString() : value) 
              )
              
            data = JSON.parse(temps);

            return {
                status: 'success',
                message: `Success get data.`,
                data: data
            };
        } catch (error) {
            this.logger.error(error.message);
            const statusCode = error.status === undefined ? HttpStatus.INTERNAL_SERVER_ERROR : error.status;
            throw new HttpException({
                statusCode: statusCode,
                message: error.message
            }, statusCode);
        }
    }

    async order(params:RestaurantDto) {
        try {
            const limit = params.limit * 1;
            const skip = (params.page - 1) * params.limit;

            const order = await this.prisma.orders.findMany({
                select: {
                    menu: {
                        select: {
                            name: true,
                            price: true,
                            restaurant: {
                                select: {
                                    id: true,
                                    name: true,
                                    latitude: true,
                                    longitude: true
                                }
                            }
                        }
                    }
                },
                skip: skip,
                take: limit
            });
    
            return {
                status: 'success',
                message: `Success get data.`,
                data: order
            };
        } catch (error) {
            this.logger.error(error.message);
            const statusCode = error.status === undefined ? HttpStatus.INTERNAL_SERVER_ERROR : error.status;
            throw new HttpException({
                statusCode: statusCode,
                message: error.message
            }, statusCode);
        }
    }
}
