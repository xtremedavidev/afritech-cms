import { ProgressProvider } from "@bprogress/next/app"

const Progress = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			{children}
			<ProgressProvider
				height="4px"
				color="#000000"
				options={{ showSpinner: true }}
				shallowRouting
			/>
		</>
	)
}

export default Progress
