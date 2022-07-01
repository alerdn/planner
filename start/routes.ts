import Route from "@ioc:Adonis/Core/Route";

import UserRoute from "./routes/user";
import CardRoute from "./routes/card";
import ProjectRoute from "./routes/project";

UserRoute(Route);
CardRoute(Route);
ProjectRoute(Route);
