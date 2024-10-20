"use client";
import { useAppDispatch } from "@/hooks/reduxHooks";
import {
  IBreadcrumbState,
  updateBreadcrumb,
} from "@/reduxConfig/breadcrumbSlice";

import React from "react";

type Props = {
  items: IBreadcrumbState[];
};

const UpdateBreadcrumb = (props: Props) => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(updateBreadcrumb(props.items));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return <></>;
};

export default UpdateBreadcrumb;
