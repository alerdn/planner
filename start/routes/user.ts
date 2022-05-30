import Route from "@ioc:Adonis/Core/Route";

export default (route: typeof Route) => {
	route
		.group(() => {
			route.post("/cadastros", "UsersController.cadastrar");
			route.post("/login", "UsersController.login");
			route.post("/senhas", "UsersController.alterarSenha").middleware("auth");
			route.post("/senhas/solicitacoes", "UsersController.solicitacaoAlterarSenha");
			route.post("/senhas/alteracoes", "UsersController.confirmacaoAlterarSenha");
			route.post("/logout", "UsersController.logout").middleware("auth");
			route.delete("/", "UsersController.excluirCadastro").middleware("auth");
			route.get("/", "UsersController.buscarUsuario").middleware("auth");
		})
		.prefix("users");
};
