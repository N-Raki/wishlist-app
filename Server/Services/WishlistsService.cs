using Server.Models;
using Server.Models.Requests;
using Server.Providers.Contracts;
using Server.Repositories.Contracts;
using Server.Services.Contracts;

namespace Server.Services;

internal sealed class WishlistsService(IWishlistsRepository wishlistsRepository, IAuthenticationDataProvider authenticationDataProvider, IUsersService usersService) : IWishlistsService
{
	public async Task<Wishlist?> GetWishlistByGuidAsync(Guid guid, CancellationToken cancellationToken = default)
	{
		var wishlist = await wishlistsRepository.GetWishlistByGuidAsync(guid, cancellationToken).ConfigureAwait(false);
		if (wishlist != null && authenticationDataProvider.AuthenticatedUser != null && authenticationDataProvider.AuthenticatedUser.Id != wishlist.UserId)
		{
			await usersService.AddRecentWishlistAsync(authenticationDataProvider.AuthenticatedUser.Id, wishlist.Id, cancellationToken);
		}
		return wishlist;
	}

	public async Task<IEnumerable<Wishlist>> GetRecentWishlistsAsync(CancellationToken cancellationToken = default)
	{
		if (authenticationDataProvider.AuthenticatedUser is null)
		{
			throw new ArgumentException("User not authenticated");
		}
		var userId = authenticationDataProvider.AuthenticatedUser.Id;
		var user = await usersService.GetUserByGuidAsync(userId, cancellationToken).ConfigureAwait(false);
		if (user is null)
		{
			throw new ArgumentException("User not found");
		}
		return await wishlistsRepository.GetWishlistsByGuidsAsync(user.RecentWishlistIds, cancellationToken).ConfigureAwait(false);
	}

	public async Task<Wishlist> CreateWishlistAsync(CreateWishlistRequest createWishlistRequest, CancellationToken cancellationToken = default)
	{
		if (authenticationDataProvider.AuthenticatedUser is null)
		{
			throw new ArgumentException("User not authenticated");
		}
		var wishlist = new Wishlist
		{
			UserId = authenticationDataProvider.AuthenticatedUser.Id,
			Name = createWishlistRequest.Name
		};
		return await wishlistsRepository.CreateWishlistAsync(wishlist, cancellationToken).ConfigureAwait(false);
	}

	public async Task DeleteWishlistByGuidAsync(Guid guid, CancellationToken cancellationToken = default)
	{
		if (authenticationDataProvider.AuthenticatedUser is null)
		{
			throw new ArgumentException("User not authenticated");
		}
		var userId = authenticationDataProvider.AuthenticatedUser.Id;
		var wishlist = await wishlistsRepository.GetWishlistByGuidAsync(guid, cancellationToken).ConfigureAwait(false);
		if (wishlist == null || wishlist.UserId != userId)
		{
			throw new ArgumentException("Wishlist not found");
		}
		await wishlistsRepository.DeleteWishlistAsync(wishlist, cancellationToken).ConfigureAwait(false);
	}
}
