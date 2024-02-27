namespace Server.Models.Responses;

public sealed class UserResponse
{
	public Guid Id { get; init; }
	public string DisplayName { get; init; } = null!;
	public string Email { get; init; } = null!;
	public IEnumerable<WishlistResponse> Wishlists { get; init; } = new List<WishlistResponse>();
}
