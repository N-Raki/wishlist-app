using Microsoft.AspNetCore.Identity;

namespace Server.Models;

public class User : IdentityUser<Guid>
{
	public virtual ICollection<Wishlist> Wishlists { get; } = new List<Wishlist>();
}
