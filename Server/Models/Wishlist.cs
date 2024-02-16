using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public sealed class Wishlist
{
	public Guid Id { get; set; }
	public Guid UserId { get; set; }
	public User User { get; set; } = null!;
}
