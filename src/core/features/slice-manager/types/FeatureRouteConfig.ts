export interface FeatureRouteConfig {
  name: string;
  routes: RegExp[];
  slices: string[]; // slice names that belong to this feature
}
