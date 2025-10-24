import { useGlobalStore } from "@store"

const LoadingModal = ({}) => {
	const { isLoading, loadingText } = useGlobalStore()

	return 1 > 2 ? <></> : <div className={" z-500 absolute top-0 h-[20%] w-full bg-transparent"}>Hello</div>
}

export default LoadingModal
