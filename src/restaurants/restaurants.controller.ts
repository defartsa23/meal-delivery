import { 
    Body, 
    Controller, 
    Get, 
    Logger, 
    Post, 
    Query, 
    Req, 
    UseGuards, 
    UsePipes, 
    ValidationPipe 
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard, OptionalJwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { LoginRestoDto, PopularRestoDto, RestaurantDto, TransactionRestoDto } from './dto/restaurant.dto';
import { RestaurantsService } from './restaurants.service';

@ApiTags('Restaurant')
@Controller('restaurants')
export class RestaurantsController {
    private readonly logger: Logger = new Logger(RestaurantsController.name);

    constructor(
        private readonly restoService: RestaurantsService
    ) {}

    @Get()
    @ApiOperation({ summary: 'Endpoint utuk get data restaurant.' })
    @ApiResponse({ status: 200, description: 'Success get data.'})
    @ApiResponse({ status: 404, description: 'Data tidak ditemukan.'})
    @UseGuards(OptionalJwtAuthGuard)
    @UsePipes(new ValidationPipe({
        transform: true
    }))
    async get(
        @Req() req: any,
        @Query() query:RestaurantDto
    ) {
        return await this.restoService.getRestaurant(req.user, query);
    }

    @Get('popular')
    @ApiOperation({ summary: 'Endpoint utuk get data popular seluruh restaurant.' })
    @ApiResponse({ status: 200, description: 'Success get data.'})
    @ApiResponse({ status: 404, description: 'Data tidak ditemukan.'})
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {enableImplicitConversion: true},
        forbidNonWhitelisted: true
    }))
    async getPopular(@Query() query:PopularRestoDto) {
        return await this.restoService.popular(query);
    }

    @Get('transactions')
    @ApiOperation({ summary: 'Endpoint utuk get data transaksi seluruh restaurant.' })
    @ApiResponse({ status: 200, description: 'Success get data.'})
    @ApiResponse({ status: 404, description: 'Data tidak ditemukan.'})
    @UsePipes(new ValidationPipe({
        transform: true
    }))
    async getTransaction(@Query() query:TransactionRestoDto) {
        return await this.restoService.order(query);
    }

    @Get('profile')
    @ApiOperation({ summary: 'Endpoint utuk get profile restaurant.' })
    @ApiResponse({ status: 200, description: 'Success get data profile.'})
    @Roles(Role.Resto)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req) {
        return {
            statusCode: 200,
            message: "Success get data profile.",
            data: req.user
        };
    }

    @Post('login')
    @ApiOperation({ summary: 'Endpoint utuk get profile restaurant.' })
    @ApiResponse({ status: 200, description: 'Success get data profile.'})
    @ApiResponse({ status: 400, description: 'Username atau Password salah.'})
    @ApiResponse({ status: 404, description: 'User tidak terdaftar.'})
    @UsePipes(new ValidationPipe())
    async login(@Body() body: LoginRestoDto) {
        return await this.restoService.login(body);
    }
}
