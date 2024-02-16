using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Server.Models;

public sealed class User : IdentityUser<Guid>
{
	public ICollection<Wishlist> Wishlists { get; } = new List<Wishlist>();
}
