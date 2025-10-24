import React from "react"
import { useCreateService } from "@commons/api/services"
import { useGlobalStore } from "@store"
import { useRouter } from "@router"
import ServiceEditor from "@src/pages/(protected)/(dashboard)/services/_component/ServiceEditor.component"

export default function CreateService({}) {
	const { loader } = useGlobalStore()

	const router = useRouter()
	const { mutateAsync: createService, isPending: isCreating } = useCreateService()

	const onSubmit = ({ data, files, draft }: { data: any; files: Record<string, File>; draft: boolean }) => {
		loader.start()
		createService({ ...data, files })
			.then((res) => {
				router.push(`/services`)
			})
			.finally(() => loader.reset())
	}

	return (
		<ServiceEditor
			title="Add Service"
			subtitle="Select a category and write a new service."
			viewType="create"
			initialData={null}
			onSubmit={onSubmit}
			isLoading={isCreating}
		/>
	)
}
