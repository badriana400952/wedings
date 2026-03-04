import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      template: string;
    };
    authorized: boolean;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    template: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    template: string;
  }
}
