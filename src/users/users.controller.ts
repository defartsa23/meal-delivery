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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { countTransaction, LoginDto, OrderDto, UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    private readonly logger: Logger = new Logger(UsersController.name);
    
    constructor(
        private readonly userService: UsersService
    ) {}

    @Get()
    @ApiOperation({ summary: 'Endpoint utuk get semua data user.' })
    @ApiResponse({ status: 200, description: 'Success get data profile.'})
    @UsePipes(new ValidationPipe({
        transform: true
    }))
    getUsers(@Query() query:UserDto): object {
        return this.userService.findAll(query);
    }

    @Get('profile')
    @ApiOperation({ summary: 'Endpoint utuk get profile restaurant.' })
    @ApiResponse({ status: 200, description: 'Success get data profile.'})
    @Roles(Role.User)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req) {
        return {
            statusCode: 200,
            message: "Success get data profile.",
            data: req.user
        };
    }

    @Get('countTransaction')
    @ApiOperation({ summary: 'Endpoint utuk get data transaction perhari.' })
    @ApiResponse({ status: 200, description: 'Success get data.'})
    @ApiResponse({ status: 404, description: 'Data tidak ditemukan.'})
    @UsePipes(new ValidationPipe({
        transform: true
    }))
    async getCountTransaction(@Query() query:countTransaction) {
        return await this.userService.countTransaction(query);
    }

    @Get('order')
    @ApiOperation({ summary: 'Endpoint utuk get data order user.' })
    @ApiResponse({ status: 200, description: 'Success get data.'})
    @ApiResponse({ status: 404, description: 'Data tidak ditemukan.'})
    @UsePipes(new ValidationPipe({
        transform: true
    }))
    async getOrder(@Query() query:UserDto) {
        return await this.userService.order(query);
    }

    @Post('login')
    @ApiOperation({ summary: 'Endpoint utuk get profile restaurant.' })
    @ApiResponse({ status: 200, description: 'Success get data profile.'})
    @ApiResponse({ status: 400, description: 'Username atau Password salah.'})
    @ApiResponse({ status: 404, description: 'User tidak terdaftar.'})
    @UsePipes(new ValidationPipe())
    async login(@Body() body: LoginDto) {
        return await this.userService.login(body);
    }

    @Post('order')
    @ApiOperation({ summary: 'Endpoint utuk melakukan pemesanan makanan.' })
    @ApiResponse({ status: 200, description: 'Success get data.'})
    @ApiResponse({ status: 404, description: 'Data tidak ditemukan.'})
    @Roles(Role.User)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    async postOrder(@Req() req, @Body() body: OrderDto) {
        return await this.userService.createOrder(req.user, body);
    }
}
