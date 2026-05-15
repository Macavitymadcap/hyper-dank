import { Repository } from "./repository";

export const db = new Repository();

export type { WalkWithStats, Stats } from "./model";