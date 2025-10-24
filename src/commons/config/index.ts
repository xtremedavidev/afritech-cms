import { default as useFormConfig, type UseFormConfig } from "@commons/config/useForm.config"

export interface IConfig {
	useForm: UseFormConfig
}

const Config: IConfig = {
	useForm: useFormConfig as any,
}

export default Config
