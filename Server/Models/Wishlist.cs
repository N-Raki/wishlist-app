namespace Server.Models;

public class Wishlist
{
	// Properties
	public Guid Id { get; init; }
	public Guid UserId { get; init; }

	// Navigation properties
	public virtual User User { get; } = null!;
	public virtual IEnumerable<Item> Items { get; } = new List<Item>();
}
