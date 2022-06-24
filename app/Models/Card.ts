import { BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Entry from "./Entry";
import User from "./User";

export default class Card extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public dataCriado: string;

	@column()
	public userId: number;

	@column()
	public label: string;

	@column()
	public projectId: number

	@belongsTo(() => User)
	public user: BelongsTo<typeof User>;

	@hasMany(() => Entry)
	public entries: HasMany<typeof Entry>;
}
