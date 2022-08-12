import { 
    BadRequestException,
    HttpCode,
    HttpException,
    HttpStatus,
    Injectable, 
    InternalServerErrorException, 
    Logger, 
    NotFoundException
} from '@nestjs/common';
import { countTransaction, LoginDto, OrderDto, UserDto } from './dto/user.dto';
import { Prisma, Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from 'src/common/dto/jwt-payload.dto';

@Injectable()
export class UsersService {
    private readonly logger: Logger = new Logger(UsersService.name);

    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService
    ) {}

    async findAll(params:UserDto) {
        const limit = params.limit;

        return await this.prisma.$queryRaw`SELECT u.id, u.name, u.balance, u.latitude, u.longitude, SUM(o.amount) as totalTransactions FROM Users u INNER JOIN Orders o ON o.userId = u.id GROUP BY u.id ORDER BY totalTransactions DESC LIMIT ${limit};`;
    }

    async login(body:LoginDto) {
        try {
            const { id, password } = body;

            const user:Users = await this.prisma.users.findUnique({
                where: {
                    id: id
                }
            });

            if (!user) {
                throw new NotFoundException({
                  status: 'failed',
                  message: 'Data not found',
                });
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
                role: 'user',
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

    async order(params:UserDto) {
        try {
            const limit = params.limit * 1;
            const skip = (params.page - 1) * params.limit;

            const order = await this.prisma.users.findMany({
                select: {
                    id: true,
                    name: true,
                    balance: true,
                    orders: {
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
                        }
                    }
                },
                skip,
                take: limit
            });

            if (!order) {
                return new NotFoundException({
                  status: 'failed',
                  message: 'Data not found',
                });
            }
    
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

    async countTransaction(params:countTransaction) {
        try {
            const fromDate = params.fromDate.toISOString().split('T')[0];
            const endDate = params.endDate.toISOString().split('T')[0];

            const query = 'SELECT ' +
                    'COUNT(o.userId) totalTransaction, ' +
                    `SUM(case when o.amount < ${params.limit} then 1 else 0 end) transactionBelow, ` +
                    `SUM(case when o.amount > ${params.limit} then 1 else 0 end) transactionAbove, ` +
                    'DATE(o.createdAt) dateTransaction ' +
                'FROM Users u ' +
                'INNER JOIN Orders o ON o.userId = u.id ' +
                `WHERE DATE(o.createdAt) BETWEEN "${fromDate}" AND "${endDate}" ` +
                'GROUP BY DATE(o.createdAt);'
            
            let data = await this.prisma.$queryRawUnsafe(
                query
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

    async createOrder(user:JwtPayloadDto, params:OrderDto) {
        try {
            const tempTransaction = await this.prisma.$transaction(async (prisma) => {
                const userId = user.id;
                const restaurantId = params.restaurantId;
                let totalAmount = 0;

                const menus = await prisma.menus.findMany({
                    where: {
                        restaurantId
                    }
                });
                
                for (const menu of params.listMenu) {
                    const tempFind = menus.find((data) => data.id === menu.menuId);

                    for (let index = 0; index < menu.total; index++) {
                        totalAmount += menu.price;
                    }

                    if (!tempFind) 
                        throw new BadRequestException({
                            status: "error",
                            message: "Bad Request."
                        })
                }

                const tempUser = await this.prisma.users.update({
                    where: {
                        id: userId
                    },
                    data: {
                        balance: {
                            decrement: totalAmount
                        }
                    }
                });

                const tempRestaurant = await this.prisma.restaurants.update({
                    where: {
                        id: restaurantId
                    },
                    data: {
                        balance: {
                            increment: totalAmount
                        }
                    }
                });
                
                return tempUser
            });

            const data = {
                lastBalanceUser: tempTransaction.balance
            }

            return {
                status: "success",
                message: `${user.name} success order.`,
                data
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
