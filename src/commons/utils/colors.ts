import cssText from "@assets/css/colors.css?inline"

// Same parsing functions as before
interface ColorTheme {
	[key: string]: string
}

interface ParsedColors {
	light: ColorTheme
	dark: ColorTheme
}

function parseCSSColors(cssContent: string): ParsedColors {
	const colors: ParsedColors = { light: {}, dark: {} }
	const cleanCSS = cssContent
		.replace(/\/\*[\s\S]*?\*\//g, "")
		.replace(/\s+/g, " ")
		.trim()

	const rootMatch = cleanCSS.match(/:root\s*\{([^}]+)\}/)
	if (rootMatch) {
		colors.light = extractVariables(rootMatch[1])
	}

	const darkMatch = cleanCSS.match(/:root\[data-theme="dark"\]\s*\{([^}]+)\}/)
	if (darkMatch) {
		colors.dark = extractVariables(darkMatch[1])
	}

	return colors
}

function extractVariables(cssBlock: string): ColorTheme {
	const variables: ColorTheme = {}
	const variableRegex = /--([^:]+):\s*([^;]+);/g
	let match

	while ((match = variableRegex.exec(cssBlock)) !== null) {
		const varName = match[1].trim()
		const varValue = match[2].trim()

		if (!varValue.startsWith("var(")) {
			variables[varName] = varValue
		}
	}

	return variables
}

const parsedColors = parseCSSColors(cssText)
export const { light, dark } = parsedColors
export default parsedColors.light
