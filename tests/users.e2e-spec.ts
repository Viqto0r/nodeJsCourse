import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'UserTest@mail.ru', password: 'UserTest123!' });

		expect(res.statusCode).toBe(422);
	});

	it('Login - success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'UserTest@mail.ru', password: 'UserTest123!' });

		expect(res.statusCode).toBe(200);
		expect(res.ok).toBeTruthy();
		expect(res.body.jwt).toBeDefined();
	});

	it('Login - error', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'UserTest@mail.ru', password: 'UserTest123!Wrong' });

		expect(res.statusCode).toBe(401);
		expect(res.ok).toBeFalsy();
		expect(res.body.jwt).toBeUndefined();
	});

	it('Info - success', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'UserTest@mail.ru', password: 'UserTest123!' });

		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);

		expect(res.statusCode).toBe(200);
		expect(res.ok).toBeTruthy();
		expect(res.body.email).toBe('UserTest@mail.ru');
	});

	it('Info - error', async () => {
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer Wrong`);

		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
