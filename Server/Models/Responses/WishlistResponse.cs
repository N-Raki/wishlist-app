namespace Server.Models.Responses;

public sealed class WishlistResponse
{
	public Guid Id { get; init; }
	public IEnumerable<ItemResponse> Items { get; init; } = new List<ItemResponse>(); 
}
