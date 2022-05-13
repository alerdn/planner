import { BaseModel, belongsTo, BelongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";

export default class Card extends BaseModel {
    @column({isPrimary: true})
    public id: number;

    @column()
    public userId: number;

    @column()
    public label: string;

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>;
}