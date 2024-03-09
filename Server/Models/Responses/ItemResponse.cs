using System.ComponentModel.DataAnnotations;

namespace Server.Models.Responses;

public class ItemResponse
{
	public Guid Id { get; init; }
	public Guid WishlistId { get; init; }
	[MaxLength(255)] public string Name { get; init; } = string.Empty;
	[MaxLength(255)] public string? Url { get; init; }
	public float? Price { get; init; }
	public List<Guid> BuyerIds { get; init; } = [];
}
