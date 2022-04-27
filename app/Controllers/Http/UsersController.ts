import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class UsersController {
	public async store({ request }: HttpContextContract) {
		return await User.create({nome: "Alexandre", email: "alexandre@gmail.com", senha: "12346578"});
	}
}
