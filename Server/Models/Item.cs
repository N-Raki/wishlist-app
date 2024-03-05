using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class Item
{
	// Properties
	public Guid Id { get; init; }
	public Guid WishlistId { get; init; }
	[MaxLength(255)] public string Name { get; set; } = string.Empty;
	[MaxLength(255)] public string? Url { get; set; }
	public float? Price { get; set; }
	public Guid? BuyerId { get; init; }
	
	// Navigation properties
	public virtual Wishlist Wishlist { get; } = null!;
}
