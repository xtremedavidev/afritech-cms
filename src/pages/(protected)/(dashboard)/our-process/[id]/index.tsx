import { useDeleteProcess, useGetProcess } from "@/src/commons/api/our-process"
import { useGlobalStore } from "@/src/commons/store"
import { showConfirmationModal } from "@components/ConfirmationModal"
import { useParams, useRouter } from "@router"
import { toast } from "sonner"
import ProcessEditor from "../_component/Editor.component"

export default function ViewProcess({}) {
	const { id } = useParams()

	const { data: process } = useGetProcess(id)

	const { loader } = useGlobalStore()
	const router = useRouter()
	const { data: deleteProcess } = useDeleteProcess(id)

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
			title="View Process"
			subtitle="View the details of your process item."
			viewType="view"
			initialData={process}
			onSubmit={onDelete}
			isLoading={false}
		/>
	)
}
