using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class Item
{
	// Properties
	public Guid Id { get; init; }
	public Guid WishlistId { get; init; }
	[MaxLength(255)] public string Name { get; init; } = null!;
	[MaxLength(255)] public string? Url { get; init; }
	public float? Price { get; init; }
	public Guid? BuyerId { get; init; }
	
	// Navigation properties
	public virtual Wishlist Wishlist { get; } = null!;
}
