export const ROUTES = {
  HOME: '/',
  INTERVIEW: {
    CREATE: '/interview',
    EDIT: (id) => `/interview?id=${id}`,
  }
};
