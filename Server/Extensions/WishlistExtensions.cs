using System.Collections;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Extensions;

public static class WishlistExtensions
{
   public static async Task<Wishlist?> GetWishlistWithSortedItemsAsync(this IQueryable<Wishlist> query, Guid wishlistId, CancellationToken cancellationToken)
   {
      return await query
         .Where(w => w.Id == wishlistId)
         .Include(w => w.Items.OrderBy(i => i.CreatedAt))
         .FirstOrDefaultAsync(cancellationToken);
   }
   
   public static async Task<IEnumerable<Wishlist>> GetWishlistsWithSortedItemsAsync(this IQueryable<Wishlist> query, IEnumerable<Guid> wishlistIds, CancellationToken cancellationToken)
   {
      return await query
         .Where(w => wishlistIds.Contains(w.Id))
         .Include(w => w.Items.OrderBy(i => i.CreatedAt))
         .OrderBy(w => w.CreatedAt)
         .ToListAsync(cancellationToken);
   }
}
