using Riok.Mapperly.Abstractions;
using Server.Mappers.Contracts;
using Server.Models;
using Server.Models.Responses;
using Server.Providers.Contracts;

namespace Server.Mappers;

[Mapper]
internal sealed partial class WishlistMapper(IItemMapper itemMapper, IAuthenticationDataProvider authenticationDataProvider) : IWishlistMapper
{
	[UseMapper] private readonly IItemMapper _itemMapper = itemMapper;

	public WishlistResponse MapToResponse(Wishlist wishlist)
	{
		var response = ToResponse(wishlist);
		response.IsOwner = authenticationDataProvider.AuthenticatedUser?.Id == wishlist.UserId;
		return response;
	}
	private partial WishlistResponse ToResponse(Wishlist wishlist);
}
