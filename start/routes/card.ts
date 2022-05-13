import Route from "@ioc:Adonis/Core/Route";

export default (route: typeof Route) => {
	route
		.group(() => {
			route.post("/", "CardController.addCard");
			route.post("/entries", "CardController.addEntry");
            route.post("/entries/completes", "CardController.completeEntry");
		})
		.prefix("cards")
		.middleware("auth");
};
