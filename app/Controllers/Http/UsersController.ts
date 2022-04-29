import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class UsersController {
	public async cadastrar({ request, response }: HttpContextContract) {
		const { email, senha } = request.all();

		try {
			return await User.create({ email, senha });
		} catch (error) {
			response.badRequest({ success: false, message: error.message });
		}
	}
}
