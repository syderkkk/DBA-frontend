export interface LoginData {
  email: string;
  password: string;
}

// Definición de la interfaz User
export interface User {
  name: string;
  email: string;
  role: string;
}


// Interfaz para las tarjetas de características
export interface FeatureCardProps {
  title: string;
  description: string;
  iconSrc: string;
}


// Definición de la interfaz CharacterCardProps
export interface CharacterCardProps {
  title: string;
  description: string;
  imageUrl: string;
  features: string[];
}

export interface UserContextProps {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

export interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}