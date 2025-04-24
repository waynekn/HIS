export type User = {
  id: string;
  username: string;
  email: string;
};

export type CurrentUser = User & {
  isLoading: boolean;
  isLoggedIn: boolean;
};
