import Route from "@ioc:Adonis/Core/Route";

export default (route: typeof Route) => {
	route
		.group(() => {
            route.get("/", "CardController.projects");
			route.post("/", "CardController.addProject");
		})
		.prefix("projects")
		.middleware("auth");
};
