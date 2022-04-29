import Route from "@ioc:Adonis/Core/Route";

export default (route: typeof Route) => {
	route
		.group(() => {
			route.post("/cadastros", "UsersController.cadastrar");
			route.post("/login", "UsersController.login");
			route.post("/senhas", "UsersController.alterarSenha").middleware("auth");
			route.post("/logout", "UsersController.logout").middleware("auth");
		})
		.prefix("users");
};
