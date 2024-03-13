namespace Server.Models.Options;

public sealed class NetworkOptions
{
    public const string Network = "Network";
    
    public string ClientUrl { get; init; } = string.Empty;
}