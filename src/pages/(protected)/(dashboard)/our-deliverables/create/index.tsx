import { useCreateDeliverable } from "@/src/commons/api/our-deliverables"
import { IDeliverable } from "@/src/commons/api/our-deliverables/index.interface"
import { useRouter } from "@router"
import { useGlobalStore } from "@store"
import DeliverableEditor from "../_component/DeliverableEditor.component"

export default function CreateDeliverable({}) {
	const { loader } = useGlobalStore()

	const router = useRouter()
	const { mutateAsync: createDeliverable, isPending: isCreating } = useCreateDeliverable()

	const onSubmit = ({ data }: { data: Partial<IDeliverable> }) => {
		loader.start()
		createDeliverable(data)
			.then((res) => {
				router.push(`/our-deliverables`)
			})
			.finally(() => loader.reset())
	}

	return (
		<DeliverableEditor
			title="Add Deliverable"
			subtitle="Enter the following informatioin to create a new deliverable."
			viewType="create"
			initialData={null}
			onSubmit={onSubmit}
			isLoading={isCreating}
		/>
	)
}
