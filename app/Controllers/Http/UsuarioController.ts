import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class UsuarioController {
  public async index({ request }: HttpContextContract) {
    return { teste: "testando", params: request.all() };
  }
}
