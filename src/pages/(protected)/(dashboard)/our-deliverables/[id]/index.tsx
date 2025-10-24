import { useGetDeliverable } from "@/src/commons/api/our-deliverables"
import { useParams } from "@router"
import MetricEditor from "../_component/DeliverableEditor.component"

export default function ViewDeliverable({}) {
	const { id } = useParams()

	const { data } = useGetDeliverable(id)

	return (
		<MetricEditor
			title="View Deliverable"
			subtitle="View the details of your deliverable."
			viewType="view"
			initialData={data}
			onSubmit={() => {}}
			isLoading={false}
		/>
	)
}
