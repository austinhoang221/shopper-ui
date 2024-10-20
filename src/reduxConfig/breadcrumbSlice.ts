import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import iconMap from "@/icons/iconMap";

export interface IBreadcrumbState {
  key: string;
  href: string;
  name: string;
  icon: keyof typeof iconMap;
}
export interface IBreadcrumb {
  value: IBreadcrumbState[];
}
const initialState: IBreadcrumb = {
  value: [
    {
      key: "home",
      href: "/",
      name: "Home",
      icon: "home",
    },
  ],
};
const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState: initialState,
  reducers: {
    updateBreadcrumb: (state, action: PayloadAction<IBreadcrumbState[]>) => {
      state.value.splice(1, state.value.length);
      state.value.push(...(action.payload as A));
    },
  },
});

export const { updateBreadcrumb } = breadcrumbSlice.actions;

export default breadcrumbSlice.reducer;
