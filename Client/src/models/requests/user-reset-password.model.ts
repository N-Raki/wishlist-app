export class UserResetPasswordRequest {
    public email: string = '';
    public resetCode: string = '';
    public newPassword: string = '';
}