// MAST5112 Part 2 — Christoffel's digital menu
// Student: ST10533863
// Data is NOT hardcoded. The list starts empty and is filled by the chef.

export type Course = "Starters" | "Mains" | "Desserts";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  course: Course;
  price: number;
};

// Predefined courses the chef can choose from (brief says "desert"; Desserts is used).
export const COURSES: Course[] = ["Starters", "Mains", "Desserts"];

export type RootStackParamList = {
  Home: undefined;
  Filter: undefined;
};
