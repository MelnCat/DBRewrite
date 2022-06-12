import "./providers/client";
import { development } from "./providers/env";
import { production } from "./providers/env";
import "source-map-support/register";
if (development) console.warn("Starting in development mode!");
if (production) console.warn("Starting in production mode!");
