import Route from "@ioc:Adonis/Core/Route";

export default (route: typeof Route) => {
	route
		.group(() => {
            route.get("/", "CardController.cards");
			route.post("/", "CardController.addCard");
            route.delete("/", "CardController.deleteCard");
			route.post("/entries", "CardController.addEntry");
            route.post("/entries/completes", "CardController.completeEntry");            
            route.delete("/entries", "CardController.deleteEntry");
		})
		.prefix("cards")
		.middleware("auth");
};
