import Route from "@ioc:Adonis/Core/Route";

export default (route: typeof Route) => {
	route
		.group(() => {
            route.get("/", "ProjectsController.projects");
			route.post("/", "ProjectsController.addProject");
		})
		.prefix("projects")
		.middleware("auth");
};
