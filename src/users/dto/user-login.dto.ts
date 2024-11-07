import { IsEmail, IsStrongPassword } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Не верно указан email' })
	email: string;

	@IsStrongPassword({ minLength: 6 }, { message: 'Пароль слишком слабый' })
	password: string;
}
