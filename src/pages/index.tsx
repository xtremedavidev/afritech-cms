import DashboardLayout from "@src/pages/(protected)/(dashboard)/_layout"
import Home from "@src/pages/(protected)/(dashboard)/dashboard"
import ProtectedLayout from "@src/pages/(protected)/_layout"

function BasePage({}) {
	return (
		<ProtectedLayout>
			<DashboardLayout>
				<Home />
			</DashboardLayout>
		</ProtectedLayout>
	)
}

export default BasePage
