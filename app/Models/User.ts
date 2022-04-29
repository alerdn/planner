import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import { BaseModel, beforeSave, column } from "@ioc:Adonis/Lucid/Orm";

export default class User extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column.dateTime({ autoCreate: true })
	public dataCadastro: DateTime;

	@column()
	public nome: string;

	@column()
	public email: string;

	@column({ serializeAs: null })
	public senha: string;

	@beforeSave()
	public static async hashPassword(user: User) {
		if (user.$dirty.senha) {
			user.senha = await Hash.make(user.senha);
		}
	}
}
