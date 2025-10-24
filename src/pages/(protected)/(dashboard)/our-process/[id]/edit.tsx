import { useDeleteProcess, useGetProcess, useUpdateProcess } from "@/src/commons/api/our-process"
import { showConfirmationModal } from "@components/ConfirmationModal"
import { useParams, useRouter } from "@router"
import { useGlobalStore } from "@store"
import { toast } from "sonner"
import ProcessEditor from "../_component/Editor.component"

export default function EditProcess({}) {
	const router = useRouter()
	const { id } = useParams()

	const { loader } = useGlobalStore()

	const { mutateAsync: updateProcess, isPending: isUpdating } = useUpdateProcess(id)
	const { mutateAsync: deleteProcess, isPending: isDeleting } = useDeleteProcess(id)
	const { data: process } = useGetProcess(id)

	const onSubmit = ({ data }: { data: any; draft }) => {
		loader.start()
		updateProcess({ ...data })
			.then((res) => toast.success("Process updated!"))
			.finally(() => loader.reset())
	}

	const onDelete = () => {
		showConfirmationModal({
			title: "Delete Testimonial",
			message: "Are you sure you want to delete this testimonial? This action cannot be undone.",
			onConfirm: () => {
				loader.start()
				deleteProcess()
					.then(() => {
						toast.success("Process deleted successfully")
						router.push("/our-process")
					})
					.finally(() => loader.reset())
			},
		})
	}

	return (
		<ProcessEditor
			title="Edit Process"
			subtitle="Edit and make changes to your process item."
			viewType="edit"
			initialData={process}
			onSubmit={onSubmit}
			onDelete={onDelete}
			isDeleting={isDeleting}
			isLoading={isUpdating}
		/>
	)
}
