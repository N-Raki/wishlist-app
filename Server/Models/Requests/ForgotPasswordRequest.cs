namespace Server.Models.Requests;

public sealed class ForgotPasswordRequest
{
    public required string Email { get; init; }
}