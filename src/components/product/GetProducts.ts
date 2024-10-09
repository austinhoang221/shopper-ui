"use server";

import { DummyProduct, DummyProductResponse } from "./Product";

export const getProducts = async (
  offset: number,
  limit: number
): Promise<DummyProductResponse> => {
  const url = `https://dummyjson.com/products?limit=${limit}&skip=${
    offset * limit
  }`;
  try {
    const response = await fetch(url);
    const data = (await response.json()) as DummyProductResponse;

    return data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(`An error occurred: ${error}`);
  }
};
