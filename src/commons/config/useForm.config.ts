import { UseFormProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// Schema builder function that receives z and returns schema shape
type SchemaBuilder<T extends z.ZodRawShape> = (z: typeof import("zod").z) => T

// Overloaded function signatures for type inference
export interface UseFormConfig {
	// Default config properties
	mode: "all"

	// When schema builder is provided, infer type from schema
	<T extends z.ZodRawShape>(
		options: {
			schema: SchemaBuilder<T>
		} & Omit<UseFormProps<z.infer<z.ZodObject<T>>>, "resolver">
	): UseFormProps<z.infer<z.ZodObject<T>>>

	// When no schema, use generic type
	<T = any>(options?: UseFormProps<T>): UseFormProps<T>
}

const defaultConfig: UseFormProps = {
	mode: "all",
}

const useFormConfig: UseFormConfig = ((options: any = {}) => {
	const { schema, ...restOptions } = options

	let resolver
	if (schema) {
		// Call the schema builder function with z to get the shape
		const schemaShape = schema(z)
		// Create the zod object schema
		const zodSchema = z.object(schemaShape)
		resolver = zodResolver(zodSchema)
	}

	return {
		...defaultConfig,
		...restOptions,
		resolver: resolver || restOptions.resolver,
	}
}) as UseFormConfig

// Add the default config as properties to the function
Object.assign(useFormConfig, defaultConfig)

export default useFormConfig
