export type RequireNonNullable<T extends object, K extends keyof T> = Omit<
  T,
  K
> & {
  [P in K]-?: NonNullable<T[P]>;
};
