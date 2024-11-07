import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/users.controller';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { UserService } from './users/users.service';
import { IUsersController } from './users/users.controller.interface';
import { IUserService } from './users/users.service.interface';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { UsersRepository } from './users/users.repository';

interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<IUsersController>(TYPES.UserController).to(UserController).inSingletonScope();
	bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<App>(TYPES.Application).to(App).inSingletonScope();
	bind<UsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
});

const bootstrap = async (): Promise<IBootstrapReturn> => {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);

	await app.init();

	return { app, appContainer };
};

export const boot = bootstrap();
