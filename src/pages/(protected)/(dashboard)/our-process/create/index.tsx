import { useCreateProcess } from "@/src/commons/api/our-process"
import { useRouter } from "@router"
import { useGlobalStore } from "@store"
import { __DEV__ } from "@utils"
import { useEffect } from "react"
import { toast } from "sonner"
import ProcessEditor from "../_component/Editor.component"

export default function CreateProcess({}) {
	const { loader } = useGlobalStore()

	const router = useRouter()
	const { mutateAsync: createProcess, isPending: isCreating } = useCreateProcess()

	const onSubmit = ({ data }: { data: any }) => {
		loader.start()
		createProcess({ ...data, order: Number(data.order) })
			.then((res) => {
				toast.success("Process created successfully")
				router.push(`/our-process`)
			})
			.finally(() => loader.reset())
	}

	useEffect(() => {
		if (__DEV__) {
			/*form.setValue("title", "BTC is available on clyp")
			form.setValue("description", "BTC will be available for trading on clyp")
			form.setValue("body", "<p>Sample Content</p>")*/
		}
	}, [])

	return (
		<ProcessEditor
			title="Add Process"
			subtitle="Write a new process."
			viewType="create"
			initialData={null}
			onSubmit={onSubmit}
			isLoading={isCreating}
		/>
	)
}
