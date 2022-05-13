import Route from "@ioc:Adonis/Core/Route";

import UserRoute from "./routes/user";
import CardRoute from "./routes/card";

UserRoute(Route);
CardRoute(Route);