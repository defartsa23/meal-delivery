import { Controller, Get, Logger } from '@nestjs/common';

@Controller('users')
export class UsersController {
    private readonly logger: Logger = new Logger(UsersController.name);

    @Get()
    getHello(): object {
        return {
            "message" : "Hello word"
        }
    }

}
