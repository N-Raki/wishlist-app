using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Extensions;

public static class UserExtensions
{
   public static async Task<User?> GetUserWithSortedWishlistsAsync(this IQueryable<User> query, Guid userId, CancellationToken cancellationToken)
   {
      return await query
         .Where(u => u.Id == userId)
         .Include(u => u.Wishlists.OrderBy(w => w.CreatedAt))
         .FirstOrDefaultAsync(cancellationToken);
   }
}
