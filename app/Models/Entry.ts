import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Card from "./Card";

export default class Entry extends BaseModel {
    @column({ isPrimary: true })
    public id: number;

    @column()
    public cardId: number;

    @column()
    public description: string;

    @column()
    public completed: boolean;

    @belongsTo(() => Card)
    public card: BelongsTo<typeof Card>;
}