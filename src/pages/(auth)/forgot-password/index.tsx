import FormInput from "@components/FormInput"
import { AtSymbolIcon } from "@heroicons/react/24/outline"
import CustomButton from "@components/CustomButton"
import CustomText from "@components/CustomText"
import { useForm } from "react-hook-form"
import { useGlobalStore } from "@store"
import { useRouter } from "@router"
import { handleApiError } from "@utils/axiosProvider"
import { toast } from "sonner"
import { useSearchParams } from "react-router-dom"
import CONFIG from "@commons/config"
import { useForgotPassword } from "@commons/api/auth"

const ForgotPasswordPage = ({}) => {
	const [params] = useSearchParams()
	const form = useForm(
		CONFIG.useForm({
			schema: (z) => ({
				email: z.string().email(),
			}),
		}),
	)

	const { loader } = useGlobalStore()
	const router = useRouter()
	const { mutateAsync: requestForgotPassword } = useForgotPassword()

	const onSubmit = form.handleSubmit((payload) => {
		loader.start()
		requestForgotPassword(payload)
			.then(async (data) => {
				router.push("/login")
			})
			.catch(handleApiError)
			.finally(loader.reset)
	})

	return (
		<div className="z-10 flex h-full w-full items-center justify-center gap-1  p-16">
			<form
				className="flex w-full flex-col gap-y-2"
				onSubmit={onSubmit}>
				<a
					href={"/login"}
					className="dark:text-primary/200 my-5 cursor-pointer text-sm text-primary">
					Back to Login
				</a>

				<CustomText
					heading
					text={`Forgot Password?`}
					className="text-3xl"
				/>

				<CustomText
					text={"Enter your email address and let’s help you reset your password."}
					className="mb-6 max-w-[80%] text-sm text-gray-700 dark:text-gray-400"
				/>

				<FormInput
					errors={form.formState.errors.email}
					startIcon={<AtSymbolIcon />}
					type={"email"}
					placeholder="Enter email"
					description={"Must be a valid email address."}
					className={""}
					register={form.register("email")}
				/>

				<CustomButton className="my-5 w-full py-4">Send Code</CustomButton>
			</form>
		</div>
	)
}

export default ForgotPasswordPage
