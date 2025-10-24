import { useDeleteDeliverable, useGetDeliverable, useUpdateDeliverable } from "@/src/commons/api/our-deliverables"
import { showConfirmationModal } from "@components/ConfirmationModal"
import { useParams, useRouter } from "@router"
import { useGlobalStore } from "@store"
import { toast } from "sonner"
import DeliverableEditor from "../_component/DeliverableEditor.component"

export default function EditDeliverable({}) {
	const router = useRouter()
	const { id } = useParams()

	const { loader } = useGlobalStore()

	const { mutateAsync: updateDeliverable, isPending: isUpdating } = useUpdateDeliverable(id)
	const { mutateAsync: deleteDeliverable } = useDeleteDeliverable(id)

	const { data } = useGetDeliverable(id)

	const onSubmit = ({ data }: { data: any }) => {
		loader.start()
		updateDeliverable(data)
			.then((res) => {
				toast.success("Deliverable updated!")
				router.push("/our-deliverables")
			})
			.finally(() => loader.reset())
	}

	const onDelete = () => {
		showConfirmationModal({
			title: "Delete Deliverable",
			message: "Are you sure you want to delete this deliverable? This action cannot be undone.",
			onConfirm: () => {
				loader.start()
				deleteDeliverable()
					.then(() => {
						toast.success("Deliverable deleted successfully")
						router.push("/our-deliverables")
					})
					.finally(() => loader.reset())
			},
		})
	}

	return (
		<DeliverableEditor
			title="Edit Deliverable"
			subtitle="Edit and make changes to your deliverable."
			viewType="edit"
			initialData={data}
			onSubmit={onSubmit}
			onDelete={onDelete}
			isLoading={isUpdating}
		/>
	)
}
