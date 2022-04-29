import Route from "@ioc:Adonis/Core/Route";

export default (route: typeof Route) => {
	route.group(() => {
        route.post("/cadastros", "UsersController.cadastrar");
		route.post("/login", "UsersController.login");
	}).prefix("users");
};