using Riok.Mapperly.Abstractions;
using Server.Mappers.Contracts;
using Server.Models;
using Server.Models.Responses;

namespace Server.Mappers;

[Mapper(PropertyNameMappingStrategy = PropertyNameMappingStrategy.CaseInsensitive)]
internal sealed partial class UserMapper(IWishlistMapper wishlistMapper) : IUserMapper
{
	[UseMapper] private readonly IWishlistMapper _wishlistMapper = wishlistMapper;

	public partial UserResponse MapToResponse(User user);
}
