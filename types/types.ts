export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  name: string;
  email: string;
  role: string;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  iconSrc: string;
}


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


export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      type: "spring",
      stiffness: 60,
    },
  }),
};

export interface EstudianteReal {
  id: number;
  name: string;
  email: string;
  role: string;
  current_skin: string | null;
  hp: number;
  max_hp: number;
  mp: number;
  max_mp: number;
  experience: number;
  level: number;
  gold: number;
  created_at: string;
  updated_at: string;
}

export interface PreguntaActiva {
  id: number;
  pregunta: string;
  opciones: string[];
  correcta: number;
  timestamp: number;
}

export interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

export interface CreateQuestionPayload {
  question: string;
  option_1: string;
  option_2: string;
  option_3?: string;
  option_4?: string;
  correct_option: string;
}

export interface QuestionFromBackend {
  id: number;
  question: string;
  option_1: string;
  option_2: string;
  option_3: string | null;
  option_4: string | null;
  correct_option: string;
  is_active: boolean;
  created_at: string;
}


export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface AIServiceResponse {
  question?: string;
  pregunta?: string;
  options?: string[];
  opciones?: string[];
  option_1?: string;
  option_2?: string;
  option_3?: string;
  option_4?: string;
  correctAnswer?: number;
  correct_option?: number;
}