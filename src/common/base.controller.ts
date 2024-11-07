import { Router, Request, Response } from 'express';
import { IRouteController, TExpressReturnType } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): TExpressReturnType {
		return res.type('application/json').status(code).json(message);
	}

	public ok<T>(res: Response, message: T): TExpressReturnType {
		return this.send<T>(res, 200, message);
	}

	public created(res: Response): TExpressReturnType {
		return res.status(201);
	}

	protected bindRoutes(routes: IRouteController[]): void {
		routes.forEach(({ path, method, func, middlewares = [] }) => {
			this.logger.log(`[${method}] ${path}`);
			const boundingMiddlewares = middlewares?.map((m) => m.execute.bind(m));
			const handler = func.bind(this);

			this.router[method](path, boundingMiddlewares.concat(handler));
		});
	}
}
