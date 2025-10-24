import React from "react"
import { useDeleteService, useGetService, useUpdateService } from "@commons/api/services"
import { useGlobalStore } from "@store"
import { useParams, useRouter } from "@router"
import ServiceEditor from "src/pages/(protected)/(dashboard)/services/_component/ServiceEditor.component"
import { toast } from "sonner"
import { showConfirmationModal } from "@components/ConfirmationModal"

export default function EditService({}) {
	const router = useRouter()
	const { id } = useParams()

	const { loader } = useGlobalStore()

	const { mutateAsync: updateService, isPending: isUpdating } = useUpdateService(id)
	const { mutateAsync: deleteService, isPending: isDeleting } = useDeleteService(id)
	const { data: service } = useGetService(id)

	const onSubmit = ({ data, files }: { data: any; files: Record<string, File>; draft }) => {
		loader.start()
		updateService({ ...data, files })
			.then((res) => toast.success("Service updated!"))
			.finally(() => loader.reset())
	}

	const onDelete = () => {
		showConfirmationModal({
			title: "Delete Service",
			message: "Are you sure you want to delete this service? This action cannot be undone.",
			onConfirm: () => {
				loader.start()
				deleteService()
					.then(() => {
						toast.success("Service deleted successfully")
						router.push("/services")
					})
					.finally(() => loader.reset())
			},
		})
	}

	return (
		<ServiceEditor
			title="Edit Service"
			subtitle="Edit and make changes to your service."
			viewType="edit"
			initialData={service}
			onSubmit={onSubmit}
			onDelete={onDelete}
			isLoading={isUpdating}
		/>
	)
}
