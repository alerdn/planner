import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Card from "App/Models/Card";
import Entry from "App/Models/Entry";

export default class CardController {
	public async addCard({ request, auth }: HttpContextContract) {
		const { label } = request.all();
		const user = auth.user!;

		return await Card.create({ label, userId: user.id });
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
        const { entry_id, completed } = request.all();
        const user = auth.user!;

        const entry = await Entry.findOrFail(entry_id);
        await entry.load("card");

        const card = entry.card;
        await card.load("user");

        if (card.userId != user.id)
			return response.badRequest("Você não tem autorização alterar essa entrada");

        entry.merge({ completed });

        return await entry.save();
    }
}
