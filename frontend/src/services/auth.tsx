import React from 'react';

enum UserTypes {
  Guest = 0,
  Subscriber = 1,
}

interface User {
  id: string;
  name: string;
  email: string;
  userType: UserTypes;
  token: string;
}

const DEFAULT_USER = {
  id: '',
  name: '',
  email: '',
  userType: UserTypes.Guest,
  token: '',
};

export const AuthContext = React.createContext<
  [User, React.Dispatch<React.SetStateAction<User>>]
>([DEFAULT_USER, () => {}]);

export const AuthConsumer = AuthContext.Consumer;

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState<User>(DEFAULT_USER);
  return (
    <AuthContext.Provider value={[user, setUser]}>
      {children}
    </AuthContext.Provider>
  );
};
