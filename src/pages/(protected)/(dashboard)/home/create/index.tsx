import { useCreateMetric } from "@/src/commons/api/home"
import { useRouter } from "@router"
import { useGlobalStore } from "@store"
import { toast } from "sonner"
import MetricEditor from "../_component/MetricEditor.component"

export default function CreateMetric({}) {
	const { loader } = useGlobalStore()

	const router = useRouter()
	const { mutateAsync: createMetric, isPending: isCreating } = useCreateMetric()

	const onSubmit = ({ data, draft }: { data: any; draft: boolean }) => {
		loader.start()
		createMetric({ ...data, status: draft ? "draft" : "published" })
			.then((res) => {
				toast.success("Metrci card created successfully!")
				router.push(`/home`)
			})
			.finally(() => loader.reset())
	}

	return (
		<MetricEditor
			title="Add Metric"
			subtitle="Enter the following informatioin to create a new metric."
			viewType="create"
			initialData={null}
			onSubmit={onSubmit}
			isLoading={isCreating}
		/>
	)
}
