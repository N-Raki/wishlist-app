using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class Wishlist
{
	public Guid Id { get; set; }
	public Guid UserId { get; set; }
	public virtual User User { get; set; } = null!;
}
