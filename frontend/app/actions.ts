"use server";

import tilesList from "./tiles-list.json";

export async function getAllTilePaths(): Promise<string[]> {
  return tilesList;
}
