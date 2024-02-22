using Riok.Mapperly.Abstractions;
using Server.Mappers.Contracts;
using Server.Models;
using Server.Models.Responses;

namespace Server.Mappers;

[Mapper]
internal sealed partial class WishlistMapper(IItemMapper itemMapper) : IWishlistMapper
{
	[UseMapper] private readonly IItemMapper _itemMapper = itemMapper;
	
	public partial WishlistResponse MapToResponse(Wishlist wishlist);
}
