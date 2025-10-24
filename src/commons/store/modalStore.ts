import { create } from "zustand"

interface IModalState {
    showWelcomeDialog: boolean,
    showGiveChangeDialog: boolean,
    showFundBranchDialog: boolean,
    showFundAccountDialog: boolean,
    setShowWelcomeDialog: (value: boolean) => void,
    setShowGiveChangeDialog: (value: boolean) => void,
    setShowFundAccountDialog: (value: boolean) => void,
    setShowFundBranchDialog: (value: boolean, props?: {
        branch: any,
        refresh: () => void
    }) => void,
}

export const useModalStore = create<IModalState>((set) => ({
    showWelcomeDialog: false,
    showGiveChangeDialog: false,
    showFundBranchDialog: false,
    showFundAccountDialog: false,
    setShowWelcomeDialog: (value) => set((state) => ({ showWelcomeDialog: value })),
    setShowGiveChangeDialog: (value) => set((state) => ({ showGiveChangeDialog: value })),
    setShowFundBranchDialog: (value, props = null) => set((state) => ({
        showFundBranchDialog: value,
        bufferData: props,
    })),
    setShowFundAccountDialog: (value) => set((state) => ({ showFundAccountDialog: value })),
}))
