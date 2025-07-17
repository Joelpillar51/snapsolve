export type RootTabParamList = {
  Home: undefined;
  Quiz: undefined;
  Solve: undefined;
  Progress: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}