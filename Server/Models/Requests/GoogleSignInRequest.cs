namespace Server.Models.Requests;

public sealed class GoogleSignInRequest
{
    public string Token { get; set; } = string.Empty;
}