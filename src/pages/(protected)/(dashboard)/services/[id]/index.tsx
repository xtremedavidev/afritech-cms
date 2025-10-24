import React from "react"
import { useGetService } from "@commons/api/services"
import { useParams } from "@router"
import ServiceEditor from "src/pages/(protected)/(dashboard)/services/_component/ServiceEditor.component"

export default function EditService({}) {
	const { id } = useParams()

	const { data: service } = useGetService(id)

	return (
		<ServiceEditor
			title="View Service"
			subtitle="View the details of your service."
			viewType="view"
			initialData={service}
			onSubmit={() => {}}
			isLoading={false}
		/>
	)
}
