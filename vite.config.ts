import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import generouted from "@generouted/react-router/plugin"
import tsconfigPaths from "vite-tsconfig-paths"
import svgr from "vite-plugin-svgr"
import Terminal from "vite-plugin-terminal"
import tailwindcss from "@tailwindcss/vite"
import monicon from "@monicon/vite"

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 6380,
		//@ts-ignore
		allowedHosts: [],
	},
	plugins: [
		react(),
		tailwindcss(),
		tsconfigPaths(),
		svgr(),
		generouted({
			output: "./src/commons/router/router.ts",
		}),
		Terminal({
			//console: "terminal",
			output: ["console", "terminal"],
		}),

	],
	preview: {
		//@ts-ignore
		allowedHosts: [],
	},
})
