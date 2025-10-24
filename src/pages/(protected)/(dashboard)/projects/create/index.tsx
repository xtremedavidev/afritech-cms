import React, { useEffect } from "react"
import { __DEV__ } from "@utils"
import { useCreateProject } from "@commons/api/projects"
import { useGlobalStore } from "@store"
import { useRouter } from "@router"
import ProjectEditor from "src/pages/(protected)/(dashboard)/projects/_component/Editor.component"

export default function CreateProject({}) {
	const { loader } = useGlobalStore()

	const router = useRouter()
	const { mutateAsync: createProject, isPending: isCreating } = useCreateProject()

	const onSubmit = ({ data, files, draft }: { data: any; files: Record<string,File>; draft: boolean }) => {
		loader.start()
		createProject({ ...data, files, status: draft ? "draft" : "published" })
			.then((res) => {
				router.push(`/projects`)
			})
			.finally(() => loader.reset())
	}

	useEffect(() => {
		if (__DEV__) {
			/*form.setValue("title", "BTC is available on clyp")
			form.setValue("description", "BTC will be available for trading on clyp")
			form.setValue("body", "<p>Sample Content</p>")*/
		}
	}, [])

	return (
		<ProjectEditor
			title="Add Project"
			subtitle="Select a category and write a new project."
			viewType="create"
			initialData={null}
			onSubmit={onSubmit}
			isLoading={isCreating}
		/>
	)
}
