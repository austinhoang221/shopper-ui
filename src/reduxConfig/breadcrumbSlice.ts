import { createSlice } from "@reduxjs/toolkit";

interface IBreadcrumbState {
  key: string;
  href: string;
  name: string;
  icon: string;
}
const initialState: IBreadcrumbState[] = [
  {
    key: "home",
    href: "/",
    name: "Home",
    icon: "home",
  },
];
const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState: initialState,
  reducers: {},
});

export default breadcrumbSlice.reducer;
