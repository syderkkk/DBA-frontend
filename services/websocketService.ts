import Pusher, { Channel } from 'pusher-js';

// ✅ INTERFACES para tipado fuerte
interface QuestionData {
    question: {
        id: number;
        question: string;
        option_1: string;
        option_2: string;
        option_3?: string;
        option_4?: string;
        correct_answer: number;
        classroom_id: number;
        is_active: boolean;
        created_at: string;
        updated_at: string;
    };
    timestamp: string;
    event_type: string;
}

interface UserData {
    user: {
        id: number;
        name: string;
        email: string;
    };
    timestamp: string;
    event_type: string;
}

interface QuestionClosedData {
    question_id: number;
    results: {
        total_responses:    number;
        option_counts: Record<number, number>;
        percentages: Record<number, number>;
    } | null;
    timestamp: string;
    event_type: string;
}

// ✅ TIPOS para estados de conexión
type ConnectionState = 'connecting' | 'connected' | 'unavailable' | 'failed' | 'disconnected';

// ✅ TIPOS para eventos de Pusher
interface PusherConnectionStates {
    previous: ConnectionState;
    current: ConnectionState;
}

interface PusherError {
    type: string;
    error: {
        message: string;
        code?: number;
    };
}

// ✅ CONFIGURACIÓN del WebSocket Service con tipado fuerte
class WebSocketService {
    private pusher: Pusher | null = null;
    private channel: Channel | null = null;
    private currentClassroomId: string | null = null;
    private isInitialized = false;
    private connectionState: ConnectionState = 'disconnected';

    constructor() {
        this.initializePusher();
    }

    // ✅ INICIALIZAR Pusher con Reverb (sin any)
    private initializePusher(): void {
        if (this.isInitialized) return;

        try {
            const appKey = process.env.NEXT_PUBLIC_VITE_REVERB_APP_KEY;
            const host = process.env.NEXT_PUBLIC_VITE_REVERB_HOST;
            const port = process.env.NEXT_PUBLIC_VITE_REVERB_PORT;
            const scheme = process.env.NEXT_PUBLIC_VITE_REVERB_SCHEME;

            if (!appKey || !host || !port || !scheme) {
                throw new Error('Variables de entorno de Reverb no configuradas correctamente');
            }

            // Configuración para Laravel Reverb
            this.pusher = new Pusher(appKey, {
                wsHost: host,
                wsPort: parseInt(port) || 8080,
                wssPort: parseInt(port) || 8080,
                forceTLS: scheme === 'https',
                enabledTransports: ['ws', 'wss'],
                cluster: '', // No necesario para Reverb
                authEndpoint: '/api/broadcasting/auth', // Para canales privados (futuro)
            });

            // 🔧 DEBUG en desarrollo con tipado fuerte
            if (process.env.NODE_ENV === 'development') {
                this.pusher.connection.bind('connected', () => {
                    this.connectionState = 'connected';
                    console.log('🔌 Reverb WebSocket conectado exitosamente');
                });

                this.pusher.connection.bind('disconnected', () => {
                    this.connectionState = 'disconnected';
                    console.log('🔌 Reverb WebSocket desconectado');
                });

                this.pusher.connection.bind('error', (error: PusherError) => {
                    console.error('❌ Error de Reverb WebSocket:', error);
                });

                this.pusher.connection.bind('state_change', (states: PusherConnectionStates) => {
                    this.connectionState = states.current;
                    console.log('🔄 Estado WebSocket:', states.previous, '->', states.current);
                });
            }

            this.isInitialized = true;
        } catch (error) {
            console.error('❌ Error inicializando Reverb:', error);
            this.connectionState = 'failed';
        }
    }

    // ✅ CONECTAR a un aula específica (sin any)
    joinClassroom(classroomId: string): Channel | null {
        if (!this.isInitialized) {
            this.initializePusher();
        }

        if (!this.pusher) {
            console.error('❌ Pusher no está inicializado');
            return null;
        }

        if (this.currentClassroomId === classroomId && this.channel) {
            console.log(`📡 Ya conectado a aula: ${classroomId}`);
            return this.channel;
        }

        // Desconectar canal anterior si existe
        this.disconnect();

        try {
            this.currentClassroomId = classroomId;
            // 👇 CAMBIA ESTA LÍNEA
            this.channel = this.pusher.subscribe(`classroom.${classroomId}`);
            // 👆 DEBE TENER EL PREFIJO 'private-'

            console.log(`📡 Conectando a aula: ${classroomId}`);

            // ✅ EVENTOS de estado del canal con tipado
            this.channel.bind('pusher:subscription_succeeded', () => {
                console.log(`✅ Suscripción exitosa a aula: ${classroomId}`);
            });

            this.channel.bind('pusher:subscription_error', (error: PusherError) => {
                console.error(`❌ Error de suscripción a aula ${classroomId}:`, error);
            });

            return this.channel;
        } catch (error) {
            console.error('❌ Error conectando a aula:', error);
            return null;
        }
    }

    // ✅ ESCUCHAR eventos de preguntas (tipado fuerte)
    onQuestionCreated(callback: (data: QuestionData) => void): void {
        if (this.channel) {
            this.channel.bind('question.created', callback);
            console.log('👂 Escuchando eventos de pregunta creada');
        } else {
            console.warn('⚠️ No hay canal activo para escuchar eventos');
        }
    }

    onQuestionClosed(callback: (data: QuestionClosedData) => void): void {
        if (this.channel) {
            this.channel.bind('question.closed', callback);
            console.log('👂 Escuchando eventos de pregunta cerrada');
        } else {
            console.warn('⚠️ No hay canal activo para escuchar eventos');
        }
    }

    // ✅ ESCUCHAR eventos de usuarios (tipado fuerte)
    onUserJoined(callback: (data: UserData) => void): void {
        if (this.channel) {
            this.channel.bind('user.joined', callback);
            console.log('👂 Escuchando eventos de usuario unido');
        } else {
            console.warn('⚠️ No hay canal activo para escuchar eventos');
        }
    }

    onUserLeft(callback: (data: UserData) => void): void {
        if (this.channel) {
            this.channel.bind('user.left', callback);
            console.log('👂 Escuchando eventos de usuario salió');
        } else {
            console.warn('⚠️ No hay canal activo para escuchar eventos');
        }
    }

    // ✅ DESCONECTAR eventos específicos
    offQuestionCreated(): void {
        if (this.channel) {
            this.channel.unbind('question.created');
            console.log('🔇 Dejando de escuchar eventos de pregunta creada');
        }
    }

    offQuestionClosed(): void {
        if (this.channel) {
            this.channel.unbind('question.closed');
            console.log('🔇 Dejando de escuchar eventos de pregunta cerrada');
        }
    }

    offUserJoined(): void {
        if (this.channel) {
            this.channel.unbind('user.joined');
            console.log('🔇 Dejando de escuchar eventos de usuario unido');
        }
    }

    offUserLeft(): void {
        if (this.channel) {
            this.channel.unbind('user.left');
            console.log('🔇 Dejando de escuchar eventos de usuario salió');
        }
    }

    // ✅ DESCONECTAR del aula actual
    disconnect(): void {
        if (this.channel && this.pusher) {
            console.log(`📡 Desconectando de aula: ${this.currentClassroomId}`);

            // Desvincularse de todos los eventos
            this.offQuestionCreated();
            this.offQuestionClosed();
            this.offUserJoined();
            this.offUserLeft();

            // Cancelar suscripción
            this.pusher.unsubscribe(this.channel.name);
            this.channel = null;
        }
        this.currentClassroomId = null;
    }

    // ✅ INFORMACIÓN del estado de conexión (tipado fuerte)
    isConnected(): boolean {
        return this.pusher?.connection?.state === 'connected';
    }

    getConnectionState(): ConnectionState {
        return this.pusher?.connection?.state as ConnectionState || 'disconnected';
    }

    getCurrentClassroom(): string | null {
        return this.currentClassroomId;
    }

    // ✅ TESTING de conexión (sin any)
    testConnection(): void {
        if (this.isConnected()) {
            console.log('✅ WebSocket está conectado');
            console.log('📍 Aula actual:', this.currentClassroomId);
            console.log('🌐 Estado:', this.getConnectionState());
        } else {
            console.log('❌ WebSocket NO está conectado');
            console.log('🔄 Intentando reconectar...');
            this.initializePusher();
        }
    }

    // ✅ OBTENER información de debugging
    getDebugInfo(): {
        isInitialized: boolean;
        isConnected: boolean;
        currentClassroom: string | null;
        connectionState: ConnectionState;
        hasChannel: boolean;
    } {
        return {
            isInitialized: this.isInitialized,
            isConnected: this.isConnected(),
            currentClassroom: this.currentClassroomId,
            connectionState: this.getConnectionState(),
            hasChannel: this.channel !== null,
        };
    }

    // ✅ CLEANUP completo al cerrar la aplicación
    destroy(): void {
        console.log('🧹 Limpiando WebSocket Service...');
        this.disconnect();

        if (this.pusher) {
            this.pusher.disconnect();
        }

        this.isInitialized = false;
        this.pusher = null;
        this.connectionState = 'disconnected';
    }
}

// ✅ SINGLETON - Una sola instancia para toda la app
const websocketService = new WebSocketService();

// ✅ EXPORTAR tipos para usar en otros archivos
export type {
    QuestionData,
    UserData,
    QuestionClosedData,
    ConnectionState,
    PusherError,
    PusherConnectionStates
};

// ✅ EXPORTAR instancia singleton
export default websocketService;