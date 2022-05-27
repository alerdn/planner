import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Card from "App/Models/Card";
import Entry from "App/Models/Entry";

export default class CardController {
	public async addCard({ request, auth }: HttpContextContract) {
		const { label, data_criado } = request.all();
		const user = auth.user!;

		return await Card.create({ label, dataCriado: data_criado, userId: user.id });
	}

	public async addEntry({ request, response, auth }: HttpContextContract) {
		const { description, cardId } = request.all();
		const user = auth.user!;

		const card = await Card.findOrFail(cardId);
		if (card.userId != user.id)
			return response.badRequest("Você não tem autorização para adicionar essa entrada");

		return await Entry.create({ description, cardId });
	}

	public async completeEntry({ request, response, auth }: HttpContextContract) {
		const { entryId, completed } = request.all();
		const user = auth.user!;

		const entry = await Entry.findOrFail(entryId);
		await entry.load("card");

		const card = entry.card;
		await card.load("user");

		if (card.userId != user.id)
			return response.badRequest("Você não tem autorização alterar essa entrada");

		entry.merge({ completed });

		return await entry.save();
	}

	public async deleteCard({ request, response, auth }: HttpContextContract) {
		const { cardId } = request.all();
		const user = auth.user!;

		const card = await Card.findOrFail(cardId);
		await card.load("user");

		if (card.userId != user.id)
			return response.badRequest("Você não tem autorização deletar essa entrada");

		await card.load("entries");

		return await Database.transaction(async trx => {
			card.useTransaction(trx);

            card.entries.forEach(async (e: Entry) => {
                e.useTransaction(trx);
                await e.delete();
            });

            return await card.delete();
		})
	}

	public async deleteEntry({ request, response, auth }: HttpContextContract) {
		const { entryId } = request.all();
		const user = auth.user!;

		const entry = await Entry.findOrFail(entryId);
		await entry.load("card");

		const card = entry.card;
		await card.load("user");

		if (card.userId != user.id)
			return response.badRequest("Você não tem autorização deletar essa entrada");

		return await entry.delete();
	}

    public async cards({ auth }: HttpContextContract) {
        const user = auth.user!;
        const cards = await Card.query().where({ userId: user.id });
        
        for(const c of cards) {
            await c.load("entries");
        }

        return cards;
    }
}
