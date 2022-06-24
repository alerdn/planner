import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Card from "App/Models/Card";
import Entry from "App/Models/Entry";

export default class CardController {
	public async addCard({ request }: HttpContextContract) {
		const { label, data_criado, projectId } = request.all();
		return await Card.create({ label, dataCriado: data_criado, projectId });
	}

	public async addEntry({ request }: HttpContextContract) {
		const { description, cardId } = request.all();
		return await Entry.create({ description, cardId });
	}

	public async completeEntry({ request }: HttpContextContract) {
		const { entryId, completed } = request.all();

		const entry = await Entry.findOrFail(entryId);
		await entry.load("card");

		const card = entry.card;
		await card.load("project");

		entry.merge({ completed });

		return await entry.save();
	}

	public async deleteCard({ request, response, auth }: HttpContextContract) {
		const { cardId } = request.all();
		const user = auth.user!;

		const card = await Card.findOrFail(cardId);

		await card.load("project");

		if (card.project.userId != user.id)
			return response.badRequest({
				success: false,
				message: "Você não é o admin deste projeto e não pode deletar esse card",
			});

		await card.load("entries");

		return await Database.transaction(async (trx) => {
			card.useTransaction(trx);

			card.entries.forEach(async (e: Entry) => {
				e.useTransaction(trx);
				await e.delete();
			});

			return await card.delete();
		});
	}

	public async deleteEntry({ request, response, auth }: HttpContextContract) {
		const { entryId } = request.all();
		const user = auth.user!;

		const entry = await Entry.findOrFail(entryId);
		await entry.load("card");

		const card = entry.card;

		await card.load("project");
		if (card.project.userId != user.id)
			return response.badRequest({
				success: false,
				message: "Você não tem autorização deletar essa entrada",
			});

		return await entry.delete();
	}

	public async cards({ request }: HttpContextContract) {
		const { projectId } = request.all();
		const cards = await Card.query().where({ projectId });

		for (const c of cards) {
			await c.load("entries");
		}

		return cards;
	}
}
