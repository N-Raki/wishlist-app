namespace Server.Models.Requests;

public sealed class CreateItemRequest
{
	public string Name { get; init; } = null!;
	public string? Url { get; init; }
	public float? Price { get; init; }
}
