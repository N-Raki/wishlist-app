using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class Item
{
	// Properties
	public Guid Id { get; init; }
	public Guid WishlistId { get; init; }
	[MaxLength(255)] public string Name { get; set; } = string.Empty;
	[MaxLength(2048)] public string? Url { get; set; }
	public float? Price { get; set; }
	public List<Guid> BuyerIds { get; set; } = [];
   public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
	
	// Navigation properties
	public virtual Wishlist Wishlist { get; } = null!;
}
