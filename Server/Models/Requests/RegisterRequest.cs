namespace Server.Models.Requests;

public sealed class RegisterRequest
{
    public required string DisplayName { get; init; }
    public required string Email { get; init; }
    public required string Password { get; init; }
}