import { useDeleteMetric, useGetMetric, useUpdateMetric } from "@/src/commons/api/home"
import { showConfirmationModal } from "@components/ConfirmationModal"
import { useParams, useRouter } from "@router"
import { useGlobalStore } from "@store"
import { toast } from "sonner"
import MetricEditor from "../_component/MetricEditor.component"

export default function EditMetric({}) {
	const router = useRouter()
	const { id } = useParams()

	const { loader } = useGlobalStore()

	const { mutateAsync: updateMetric, isPending: isUpdating } = useUpdateMetric(id)
	const { mutateAsync: deleteMetric, isPending: isDeleting } = useDeleteMetric(id)
	const { data: metric } = useGetMetric(id)

	const onSubmit = ({ data, draft }: { data: any; draft: boolean }) => {
		loader.start()
		updateMetric({ ...data, status: draft ? "draft" : "published" })
			.then((res) => {
				toast.success("Metric card updated!")
				router.push("/home")
			})
			.finally(() => loader.reset())
	}

	const onDelete = () => {
		showConfirmationModal({
			title: "Delete Metric",
			message: "Are you sure you want to delete this metric? This action cannot be undone.",
			onConfirm: () => {
				loader.start()
				deleteMetric()
					.then(() => {
						toast.success("Metric deleted successfully")
						router.push("/home")
					})
					.finally(() => loader.reset())
			},
		})
	}

	return (
		<MetricEditor
			title="Edit Metric"
			subtitle="Edit and make changes to your metric."
			viewType="edit"
			initialData={metric}
			onSubmit={onSubmit}
			onDelete={onDelete}
			isDeleting={isDeleting}
			isLoading={isUpdating}
		/>
	)
}
