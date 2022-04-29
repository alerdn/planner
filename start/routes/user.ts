import Route from "@ioc:Adonis/Core/Route";

export default (route: typeof Route) => {
	route.group(() => {
		route.get("/", "UsersController.index");

        route.post("/cadastros", "UsersController.cadastrar");
	}).prefix("users");
};
