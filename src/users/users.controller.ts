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
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { countTransaction, LoginDto, OrderDto, UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    private readonly logger: Logger = new Logger(UsersController.name);
    
    constructor(
        private readonly userService: UsersService
    ) {}

    @Get()
    @UsePipes(new ValidationPipe({
        transform: true
    }))
    getUsers(@Query() query:UserDto): object {
        return this.userService.findAll(query);
    }

    @Get('profile')
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
    @UsePipes(new ValidationPipe({
        transform: true
    }))
    async getCountTransaction(@Query() query:countTransaction) {
        return await this.userService.countTransaction(query);
    }

    @Get('order')
    @UsePipes(new ValidationPipe({
        transform: true
    }))
    async getOrder(@Query() query:UserDto) {
        return await this.userService.order(query);
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(@Req() req: any, @Body() body: LoginDto) {
        return await this.userService.login(body);
    }

    @Post('order')
    @Roles(Role.User)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    async postOrder(@Req() req, @Body() body: OrderDto) {
        return await this.userService.createOrder(req.user, body);
    }
}
