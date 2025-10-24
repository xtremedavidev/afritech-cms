import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider } from "@mui/material"
import { COLORS, getNestedProperty, MuiTheme, sortArrayByDate } from "@utils"
import { TableRowType } from "@interfaces"
import { useSettingsStore } from "@store/settingsStore"

interface Props<T = any> {
	data: T[]
	count?: number
	rows: TableRowType<T>[]
	filter?: { key: string; value: string; type?: "exclude" | "include" }
	hideHeader?: boolean
	onRowClick?: (row: T) => void
}

export const renderTable = <T,>({ rows, data, filter, count, hideHeader }: Props<T>) => {
	const { darkMode } = useSettingsStore()
	return (
		<ThemeProvider theme={MuiTheme}>
			<TableContainer>
				<Table
					className="flex text-gray-200"
					aria-label="simple table">
					{!hideHeader && (
						<TableHead>
							<TableRow
								sx={{
									borderTop: 20,
									borderBottom: 20,
									borderColor: darkMode ? COLORS["bg-dark"] : COLORS["bg-main"],
								}}
								className="my-8 border bg-black/5 dark:bg-white/5">
								{rows
									?.filter(({ visible }) => visible)
									.map((field: any, index: number) => (
										<TableCell
											className="font-bold capitalize text-gray-300 dark:text-gray-500"
											key={index}>
											{field.label}
										</TableCell>
									))}
							</TableRow>
						</TableHead>
					)}
					<TableBody>
						{sortArrayByDate(data, "createdAt")
							?.filter((row) => {
								if (filter) {
									if (filter?.type == "exclude") {
										return (
											getNestedProperty(row, filter?.key).toLowerCase() !=
											filter?.value?.toLowerCase()
										)
									} else {
										return (
											getNestedProperty(row, filter?.key).toLowerCase() ==
											filter?.value?.toLowerCase()
										)
									}
								}
								return true
							})
							.slice(0, count ?? data?.length)
							.map((row, index) => (
								<TableRow
									key={index}
									className="font-base my-8 border bg-black/5 dark:bg-white/5"
									sx={{
										/*'&:last-child td, &:last-child th': { border: 0 },*/
										borderBottom: 20,
										borderTop: 0,
										borderColor: darkMode ? COLORS["bg-dark"] : COLORS["bg-main"],
									}}>
									{rows
										?.filter(({ visible }) => visible)
										.map((field: any, index: number) => (
											<TableCell
												className="dark:text-white"
												sx={{
													borderTop: 0,
													borderColor: "rgba(141,141,141,0)",
												}}
												key={index}>
												{field?.view
													? field?.view(row)
													: field?.format
														? field?.format(row)
														: getNestedProperty(row, field.value)}
											</TableCell>
										))}
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
		</ThemeProvider>
	)
}

export const renderTable2 = <T,>({ rows, data, hideHeader = false, filter, count, onRowClick }: Props<T>) => {
	return (
		<ThemeProvider theme={MuiTheme}>
			<TableContainer>
				<Table
					className="text-gray-200 "
					aria-label="simple table">
					{!hideHeader && (
						<TableHead>
							<TableRow className="">
								{rows
									?.filter(({ visible }) => visible)
									.map((field: any, index: number) => (
										<TableCell
											className="font-bold capitalize text-gray-300 dark:text-gray-500"
											sx={{
												borderTop: 1,
												borderColor: "rgba(141,141,141,0.28)",
											}}
											key={index}>
											{field.label}
										</TableCell>
									))}
							</TableRow>
						</TableHead>
					)}
					<TableBody>
						{sortArrayByDate(data, "createdAt")
							?.filter((row) => {
								if (filter) {
									if (filter?.type == "exclude") {
										return (
											getNestedProperty(row, filter?.key).toLowerCase() !=
											filter?.value?.toLowerCase()
										)
									} else {
										return (
											getNestedProperty(row, filter?.key).toLowerCase() ==
											filter?.value?.toLowerCase()
										)
									}
								}
								return true
							})
							.slice(0, count ?? data?.length)
							.map((row, index) => (
								<TableRow
									key={index}
									onClick={onRowClick ? () => onRowClick(row) : undefined}
									className={`font-base border-0 ${onRowClick ? "cursor-pointer hover:bg-black/5 dark:hover:bg-white/5" : ""}`}
									sx={{
										/*'&:last-child td, &:last-child th': { border: 0 },*/
										border: 0,
										borderColor: "red",
									}}>
									{rows
										?.filter(({ visible }) => visible)
										.map((field: any, index: number) => (
											<TableCell
												className={`dark:text-white`}
												sx={{
													borderTop: 0,
													borderColor: "rgba(141,141,141,0)",
												}}
												key={index}>
												{field?.view
													? field?.view(row)
													: field?.format
														? field?.format(row)
														: getNestedProperty(row, field.value)}
											</TableCell>
										))}
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
		</ThemeProvider>
	)
}
