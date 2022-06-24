import { BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Entry from "./Entry";
import Project from "./Project";

export default class Card extends BaseModel {
	@column({ isPrimary: true })
	public id: number;

	@column()
	public dataCriado: string;

	@column()
	public label: string;

	@column()
	public projectId: number

	@hasMany(() => Entry)
	public entries: HasMany<typeof Entry>;

	@belongsTo(() => Project)
	public project: BelongsTo<typeof Project>
}
