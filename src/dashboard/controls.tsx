import * as React from "react";
import { createRoot } from "react-dom/client";
import { Spotify } from "./components/controls/spotify";
import { SocialMedia } from "./components/controls/socialmedia";
import "typeface-roboto";
import { ThemeProvider } from "@mui/material/styles";
import dashboardTheme from "./dashboard-style";

const combination = (
	<ThemeProvider theme={dashboardTheme}>
		<SocialMedia />
		<Spotify />
	</ThemeProvider>
);

createRoot(document.getElementById("root")!).render(combination);
