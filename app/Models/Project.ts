import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";

export default class Project extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public nome: string;

	@column()
	public userId: number;

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>
}
