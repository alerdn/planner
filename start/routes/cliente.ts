import Route from "@ioc:Adonis/Core/Route";

export default (route: typeof Route) => {
    route.get("/users", "UsersController.index");
}