using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Server.Models;

public class User : IdentityUser<Guid>
{
	[MaxLength(30)] public string DisplayName { get; set; } = string.Empty;
	public virtual IEnumerable<Wishlist> Wishlists { get; } = new List<Wishlist>();
}
