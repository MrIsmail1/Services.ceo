export let navigate = (route: string) => {};
export const setNavigate = (newNavigate: (route: string) => void) => {
  navigate = newNavigate;
};
