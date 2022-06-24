import Route from "@ioc:Adonis/Core/Route";

export default (route: typeof Route) => {
	route
		.group(() => {
			route.get("/", "ProjectsController.projects");
			route.post("/", "ProjectsController.addProject");
			route.post("/members", "ProjectsController.addMember");
			route.delete("/members", "ProjectsController.removeMember");
		})
		.prefix("projects")
		.middleware("auth");

	route
		.group(() => {
			route.get("/members", "ProjectsController.members");
		})
		.prefix("projects");
};
