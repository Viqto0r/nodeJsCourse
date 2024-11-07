import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from './middleware.interface';

export interface IRouteController {
	path: string;
	method: keyof Pick<Router, 'get' | 'post' | 'patch' | 'put' | 'delete'>;
	func: (req: Request, res: Response, next: NextFunction) => void;
	middlewares?: IMiddleware[];
}

export type TExpressReturnType = Response<any, Record<string, any>>;
