import * as React from "react";
import { createRoot } from "react-dom/client";
import {} from "../../../../types/browser";

const Testing = () => {
	return <h1>Empty :(</h1>;
};

createRoot(document.getElementById("root")!).render(<Testing />);
