import { useGetMetric } from "@/src/commons/api/home"
import { useParams } from "@router"
import MetricEditor from "../_component/MetricEditor.component"

export default function ViewMetric({}) {
	const { id } = useParams()

	const { data: metric } = useGetMetric(id)

	return (
		<MetricEditor
			title="View Metric Card"
			subtitle="View the details of your metric card."
			viewType="view"
			initialData={metric}
			onSubmit={() => {}}
			isLoading={false}
		/>
	)
}
