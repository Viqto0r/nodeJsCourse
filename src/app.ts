import { AuthMiddleware } from './common/auth.middleware';
import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './users/users.controller';
import { ILogger } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import 'reflect-metadata';
import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { PrismaService } from './database/prisma.service';

@injectable()
export class App {
	app: Express;
	server: Server;
	port = 8001;

	constructor(
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
	}

	public useMiddleware(): void {
		const secret = this.configService.get('SECRET');
		const authMiddleware = new AuthMiddleware(secret);
		this.app.use(json(), authMiddleware.execute.bind(authMiddleware));
	}

	public useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	public useExceptionFilter(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilter();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
