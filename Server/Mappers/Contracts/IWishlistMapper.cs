using Server.Models;
using Server.Models.Responses;

namespace Server.Mappers.Contracts;

public interface IWishlistMapper
{
	WishlistResponse MapToResponse(Wishlist wishlist);
}
