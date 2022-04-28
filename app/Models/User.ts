import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

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
}
