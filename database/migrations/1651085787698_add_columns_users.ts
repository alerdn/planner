import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class AddColumnsUsers extends BaseSchema {
	protected tableName = "users";

	public async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.string("nome");
			table.string("email");
			table.string("senha");
		});
	}

	public async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("nome");
			table.dropColumn("email");
			table.dropColumn("senha");
		});
	}
}
