import FormInput from "@components/FormInput"
import { AtSymbolIcon, LockClosedIcon } from "@heroicons/react/24/outline"
import CustomButton from "@components/CustomButton"
import CustomText from "@components/CustomText"
import { useForm } from "react-hook-form"
import { useGlobalStore } from "@store"
import { useEffect } from "react"
import { __DEV__ } from "@utils"
import { useRouter } from "@router"
import { handleApiError } from "@utils/axiosProvider"
import { toast } from "sonner"
import { useSearchParams } from "react-router-dom"
import CONFIG from "@commons/config"
import { useUserLogin } from "@commons/api/auth"

const LoginPage = ({}) => {
	const [params] = useSearchParams()
	const form = useForm(
		CONFIG.useForm({
			schema: (z) => ({
				email: z.string().email(),
				password: z.string(),
			}),
		}),
	)

	const { loader } = useGlobalStore()
	const router = useRouter()
	const { mutateAsync: loginUser } = useUserLogin()

	const onSubmit = form.handleSubmit((data: any) => {
		loader.start()
		loginUser(data)
			.then(async (data) => {
				router.push("/")
			})
			.catch(handleApiError)
			.finally(loader.reset)
	})

	useEffect(() => {
		if (params.get("session_expired")) {
			toast.error("Session expired. Please login again to continue")
		}
		if (__DEV__) {
			console.log("Setting default values")
			form.setValue("email", "user1@example.com")
			form.setValue("password", "user123")
		}
	}, [])

	return (
		<div className="z-10 flex h-full w-full items-center justify-center gap-1 p-16">
			<form
				className="flex w-full flex-col gap-y-2"
				onSubmit={onSubmit}>
				<CustomText
					heading
					text={`Welcome Back!`}
					className="text-3xl"
				/>

				<CustomText
					text={"Login to your dashboard to continue"}
					className="mb-6 max-w-[80%] text-sm text-gray-700 dark:text-gray-400"
				/>

				<FormInput
					errors={form.formState?.errors.email}
					startIcon={<AtSymbolIcon />}
					type={"email"}
					placeholder="Enter email"
					description={"Must be a valid email address."}
					className={""}
					register={form.register("email")}
				/>

				<FormInput
					errors={form.formState?.errors.password}
					startIcon={<LockClosedIcon />}
					placeholder="Enter Password"
					description={"Enter your password"}
					className={""}
					register={form.register("password")}
					type="password"
				/>

				<a
					href={"forgot-password"}
					className="dark:text-primary/200 text-primary my-5 cursor-pointer self-end text-sm">
					Forgot password?
				</a>

				<CustomButton
					disabled={!form.formState.isValid}
					className="w-full py-4">
					Login
				</CustomButton>
			</form>
		</div>
	)
}

export default LoginPage
