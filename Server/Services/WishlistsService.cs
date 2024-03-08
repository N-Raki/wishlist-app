﻿using Server.Models;
using Server.Models.Requests;
using Server.Providers.Contracts;
using Server.Repositories.Contracts;
using Server.Services.Contracts;

namespace Server.Services;

internal sealed class WishlistsService(IWishlistsRepository wishlistsRepository, IAuthenticationDataProvider authenticationDataProvider) : IWishlistsService
{
	public async Task<Wishlist?> GetWishlistByGuidAsync(Guid guid, CancellationToken cancellationToken = default)
	{
		return await wishlistsRepository.GetWishlistByGuidAsync(guid, cancellationToken).ConfigureAwait(false);
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
