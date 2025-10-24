import { Area, AreaChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { COLORS } from "@utils"
import { twMerge } from "tailwind-merge"

const data = [
	{
		name: "Page A",
		uv: 4000,
		pv: 2400,
		amt: 2400,
	},
	{
		name: "Page B",
		uv: 3000,
		pv: 1398,
		amt: 2210,
	},
	{
		name: "Page C",
		uv: 2000,
		pv: 9800,
		amt: 2290,
	},
	{
		name: "Page D",
		uv: 2780,
		pv: 3908,
		amt: 2000,
	},
	{
		name: "Page E",
		uv: 1890,
		pv: 4800,
		amt: 2181,
	},
	{
		name: "Page F",
		uv: 2390,
		pv: 3800,
		amt: 2500,
	},
	{
		name: "Page G",
		uv: 3490,
		pv: 4300,
		amt: 2100,
	},
]

interface SingleAreaChartRender<T = any> {
	data: T[]
	dataKey: string
	x: {
		label?: string
		dataKey: string
	}
	y?: {
		label?: string
		dataKey?: string
	}
	fillColor?: string
	strokeColor?: string
	strokeWidth?: number
}

export const renderSingleAreaChart = <T = any,>(
	{
		data,
		dataKey,
		strokeColor = COLORS.primary,
		strokeWidth = 2,
		x = {
			label: "X Axis",
			dataKey,
		},
		y = {
			label: "Y Axis",
		},
		fillColor = COLORS.primary,
	}: SingleAreaChartRender<T>,
	className: string,
) => {
	return (
		<div className={twMerge("my-4 h-full w-full text-black dark:text-black", className)}>
			<ResponsiveContainer
				width="100%"
				height={400}>
				<AreaChart
					width={1000}
					height={400}
					data={data}>
					<defs>
						<linearGradient
							id="colorUv"
							x1="0"
							y1="0"
							x2="0"
							y2="1">
							<stop
								offset="5%"
								stopColor={fillColor}
								stopOpacity={0.6}
							/>
							<stop
								offset="95%"
								stopColor={fillColor}
								stopOpacity={0}
							/>
						</linearGradient>
					</defs>
					{/*<CartesianGrid strokeDasharray="3 3" />*/}
					<XAxis
						dataKey={x?.dataKey}
						padding={{ left: 40, right: 40 }}
						label={{
							value: x?.label,
							position: "insideBottom",
							offset: 50, // Adjust this value to increase spacing
							style: { textAnchor: "middle", rotate: 40, fontSize: "16px", fill: "#666" },
						}}
					/>
					<Tooltip />

					<YAxis
						label={{
							value: y?.label,
							position: "insideLeft",
							offset: 75,
							angle: -90, // Adjust this value to increase spacing
							style: { textAnchor: "middle", fontSize: "16px", fill: "#666" },
						}}
					/>
					<Area
						type="monotone"
						dataKey={dataKey}
						strokeWidth={strokeWidth}
						stroke={strokeColor}
						fill="url(#colorUv)"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	)
}

interface AreaConfig<T = any> {
	dataKey: keyof T // Data key for each area
	strokeColor?: string // Custom stroke color
	fillColor?: string // Custom fill color
	strokeWidth?: number // Custom stroke width
}

interface MultiAreaChartProps<T = any> {
	data: T[] // Chart data
	areas: AreaConfig<T>[] // Array of areas to render
	x?: {
		label?: string
		dataKey: keyof T
	}
	y?: {
		label?: string
	}
	className?: string
}

export const renderMultiAreaChart = <T,>(
	{
		data,
		areas,
		x = {
			label: "X Axis",
			dataKey: "x" as keyof T, // Default key for the X axis
		},
		y = {
			label: "Y Axis",
		},
	}: MultiAreaChartProps<T>,
	className = "",
) => {
	return (
		<div className={twMerge("my-4 h-full w-full text-black dark:text-black", className)}>
			<ResponsiveContainer
				width="100%"
				height={400}>
				<AreaChart
					width={1000}
					height={400}
					data={data}>
					<defs>
						{areas.map((area, index) => (
							<linearGradient
								key={`gradient-${area.dataKey as string}`}
								id={`colorUv-${index}`}
								x1="0"
								y1="0"
								x2="0"
								y2="1">
								<stop
									offset="5%"
									stopColor={area.strokeColor || "#8884d8"}
									stopOpacity={0.6}
								/>
								<stop
									offset="95%"
									stopColor={area.strokeColor || "#8884d8"}
									stopOpacity={0}
								/>
							</linearGradient>
						))}
					</defs>

					<Legend
						verticalAlign="top"
						height={36}
					/>

					<XAxis
						dataKey={x.dataKey as string}
						padding={{ left: 40, right: 40 }}
						label={{
							value: x.label,
							position: "insideBottom",
							offset: 50,
							style: { textAnchor: "middle", rotate: 40, fontSize: "16px", fill: "#666" },
						}}
					/>
					<Tooltip />
					<YAxis
						label={{
							value: y.label,
							position: "insideLeft",
							offset: 75,
							angle: -90,
							style: { textAnchor: "middle", fontSize: "16px", fill: "#666" },
						}}
					/>

					{areas.map((area, index) => (
						<Area
							key={`area-${area.dataKey as string}`}
							type="monotone"
							dataKey={area.dataKey as string}
							stroke={area.strokeColor || "#8884d8"}
							strokeWidth={area.strokeWidth || 2}
							fill={`url(#colorUv-${index})`}
						/>
					))}
				</AreaChart>
			</ResponsiveContainer>
		</div>
	)
}
