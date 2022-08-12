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
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard, OptionalJwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { LoginDto, RestaurantDto } from './dto/restaurant.dto';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
    private readonly logger: Logger = new Logger(RestaurantsController.name);

    constructor(
        private readonly restoService: RestaurantsService
    ) {}

    @Get()
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
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {enableImplicitConversion: true},
        forbidNonWhitelisted: true
    }))
    async getPopular(@Query() query:RestaurantDto) {
        return await this.restoService.popular(query);
    }

    @Get('transactions')
    @UsePipes(new ValidationPipe({
        transform: true
    }))
    async getTransaction(@Query() query:RestaurantDto) {
        return await this.restoService.order(query);
    }

    @Get('profile')
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
    @UsePipes(new ValidationPipe())
    async login(@Req() req: any, @Body() body: LoginDto) {
        return await this.restoService.login(body);
    }
}
