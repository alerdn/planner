import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Hash from '@ioc:Adonis/Core/Hash'
import User from "App/Models/User";

export default class UsersController {
	public async cadastrar({ request, response }: HttpContextContract) {
		const { email, senha } = request.all();

		try {
			return await User.create({ email, password: senha });
		} catch (error) {
			response.badRequest({ success: false, message: error.message });
		}
	}

	public async login({ request, response, auth }: HttpContextContract) {
		const { email, senha } = request.all();

		try {
			return await auth.attempt(email, senha);
		} catch (error) {
			response.badRequest({ success: false, message: error.message });
		}
	}

	public async alterarSenha({ request, response, auth }: HttpContextContract) {
		const { senhaAtual, novaSenha } = request.all();
		const user = auth.user!;

		if (!(await Hash.verify(user.password, senhaAtual))) {
			return response.badRequest("Senha atual incorreta");
		}

		user.merge({ password: novaSenha });

		return await user.save();
	}

	public async logout({ auth }: HttpContextContract) {
		await auth.use("api").revoke();

		return { success: true, message: "Usuário deslogado com sucesso" };
	}

	public async excluirCadastro({ auth }: HttpContextContract) {
		const user = auth.user!;

		await user.delete();

		return {
			success: true,
			message: "Cadastro excluído com sucesso",
		};
	}
}
