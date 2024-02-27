using System.ComponentModel.DataAnnotations;

namespace Server.Models.Responses;

public class ItemResponse
{
	public Guid Id { get; init; }
	[MaxLength(255)] public string Name { get; init; } = string.Empty;
	[MaxLength(255)] public string? Url { get; init; }
	public float? Price { get; init; }
	public Guid? BuyerId { get; init; }
}
