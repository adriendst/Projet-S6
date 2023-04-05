export interface RegisterRequestBody {
    email: string;
    password: string;
}

export interface ILogin {
    email: string;
    password: string;
}

export interface IRegister {
    email: string;
    password_hash: string;
}
