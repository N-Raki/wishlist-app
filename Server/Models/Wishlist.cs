using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class Wishlist
{
	// Properties
	public Guid Id { get; init; }
	public Guid UserId { get; init; }
	[MaxLength(30)] public string Name { get; init; } = string.Empty;

	// Navigation properties
	public virtual User User { get; } = null!;
	public virtual IEnumerable<Item> Items { get; } = new List<Item>();
}
