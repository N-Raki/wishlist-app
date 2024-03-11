namespace Server.Models.Requests;

public sealed class ResetPasswordRequest
{
    public required string CurrentPassword { get; init; }
    public required string NewPassword { get; init; }
}