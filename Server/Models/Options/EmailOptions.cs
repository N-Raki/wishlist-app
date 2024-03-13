namespace Server.Models.Options;

public sealed class EmailOptions
{
    public const string Email = "Email";
    
    public string SmtpServer { get; init; } = string.Empty;
    public int SmtpPort { get; init; }
    public string SmtpUsername { get; init; } = string.Empty;
    public string SmtpPassword { get; init; } = string.Empty;
}