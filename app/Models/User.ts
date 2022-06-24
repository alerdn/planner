import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import { BaseModel, beforeSave, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Project from "./Project";

export default class User extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column.dateTime({ autoCreate: true })
	public dataCadastro: DateTime;

	@column()
	public nome: string;

	@column()
	public sobrenome: string;

	@column()
	public email: string;

	@column({ serializeAs: null, columnName: "senha" })
	public password: string;

	@hasMany(() => Project)
	public projects: HasMany<typeof Project>;

	@beforeSave()
	public static async hashPassword(user: User) {
		if (user.$dirty.password) {
			user.password = await Hash.make(user.password);
		}
	}
}
