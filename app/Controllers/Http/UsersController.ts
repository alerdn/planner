import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Encryption from "@ioc:Adonis/Core/Encryption";
import Database from "@ioc:Adonis/Lucid/Database";
import Mail from "@ioc:Adonis/Addons/Mail";
import Hash from "@ioc:Adonis/Core/Hash";
import User from "App/Models/User";

export default class UsersController {
	public async githubAuth({ ally }: HttpContextContract) {
		const github = ally.use("github");

		if (github.accessDenied()) {
			return "Access was denied";
		}

		if (github.stateMisMatch()) {
			return "Request expired. Retry again";
		}

		if (github.hasError()) {
			return github.getError();
		}

		const user = await github.user()
		console.log(user);
		return user;
	}

	public async cadastrar({ request, response, auth }: HttpContextContract) {
		const { nome, sobrenome, email, senha } = request.all();

		try {
			const user = await User.create({ nome, sobrenome, email, password: senha });
			return {
				...(await auth.login(user)).toJSON(),
				...user.toJSON(),
			};
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

	public async buscarUsuario({ auth }: HttpContextContract) {
		return auth.user;
	}

	public async solicitacaoAlterarSenha({ request }: HttpContextContract) {
		const { email } = request.all();

		const cliente = await User.findByOrFail("email", email);

		const max = 100000;
		const min = 10000;
		const code = Math.floor(Math.random() * (max - min + 1) + min);

		const encrypted = Encryption.encrypt(code);

		const body = {
			user_id: cliente.id,
			name: "Recuperação de senha",
			type: "api",
			token: encrypted,
			created_at: new Date().toISOString(),
		};
		console.log(body);
		await Database.table("api_tokens").insert(body);

		// Envia e-mail aqui
		await Mail.send((msg) => {
			msg.subject("Recuperação de senha | Planner");
			msg.to(email);
			msg.text(`CÓDIGO DE RECUPERAÇÃO DE SENHA:\n${code}`);
		});
	}

	public async confirmacaoAlterarSenha({ request, response }: HttpContextContract) {
		const { email, codigo, senha } = request.all();

		const user = await User.findByOrFail("email", email);

		const codigobd = (
			await Database.from("api_tokens")
				.where({ user_id: user.id })
				.orderBy("created_at", "desc")
				.limit(1)
		)[0];
		const decryptedCode = Encryption.decrypt(codigobd["token"]) as string;

		if (codigo.trim() == decryptedCode) {
			user.merge({ password: senha });
			await Database.from("api_tokens").where({ id: codigobd.id }).delete();

			return await user.save();
		} else {
			return response.badRequest({ success: false, message: "Código não confere." });
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
