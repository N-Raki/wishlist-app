using Server.Helpers;
using Server.Models;
using Server.Models.Requests;
using Server.Providers.Contracts;
using Server.Repositories.Contracts;
using Server.Services.Contracts;

namespace Server.Services;

internal sealed class ItemsService(
	IItemsRepository itemsRepository,
	IUsersService usersService,
	IAuthenticationDataProvider authenticationDataProvider,
	IEmailSender emailSender
) : IItemsService
{
	public async Task<Item?> GetItemByGuidAsync(Guid guid, CancellationToken cancellationToken = default)
	{
		var userId = authenticationDataProvider.AuthenticatedUser?.Id;
		var item = await itemsRepository.GetItemByGuidAsync(guid, cancellationToken).ConfigureAwait(false);
		return item?.Wishlist.UserId == userId ? item : null;
	}

	public async Task<Item> CreateItemAsync(Guid wishlistId, CreateItemRequest request, CancellationToken cancellationToken = default)
	{
		var item = new Item
		{
			WishlistId = wishlistId,
			Name = request.Name,
			Url = request.Url,
			Price = request.Price
		};
		return await itemsRepository.CreateItemAsync(item, cancellationToken).ConfigureAwait(false);
	}

	public async Task UpdateItemAsync(Guid wishlistId, Guid guid, CreateItemRequest request,
		CancellationToken cancellationToken = default)
	{
		var userId = authenticationDataProvider.AuthenticatedUser?.Id;
		var item = await itemsRepository.GetItemByGuidAsync(guid, cancellationToken).ConfigureAwait(false);
		if (item is null || item.WishlistId != wishlistId || item.Wishlist.UserId != userId)
		{
			throw new ArgumentException("Item not found");
		}
		
		item.Name = request.Name;
		item.Url = request.Url;
		item.Price = request.Price;
		
		await itemsRepository.UpdateItemAsync(item, cancellationToken).ConfigureAwait(false);
	}

	public async Task DeleteItemByGuidAsync(Guid wishlistId, Guid guid, CancellationToken cancellationToken = default)
	{
		var userId = authenticationDataProvider.AuthenticatedUser?.Id;
		var item = await itemsRepository.GetItemByGuidAsync(guid, cancellationToken).ConfigureAwait(false);
		if (item is null || item.WishlistId != wishlistId || item.Wishlist.UserId != userId)
		{
			throw new ArgumentException("Item not found");
		}
		await itemsRepository.DeleteItemAsync(item, cancellationToken).ConfigureAwait(false);

		foreach (var buyerId in item.BuyerIds)
		{
			var buyer = await usersService.GetUserByGuidAsync(buyerId, cancellationToken).ConfigureAwait(false);
			if (buyer?.Email is null) continue;
			var message = $"{item.Wishlist.User.DisplayName} removed the item '{item.Name}' from the wishlist '{item.Wishlist.Name}'.";
			await emailSender.SendEmailAsync(buyer.Email, "Item removed from wishlist", message);
		}
	}

	public async Task PickItemAsync(Guid wishlistId, Guid guid, CancellationToken cancellationToken = default)
	{
		if (authenticationDataProvider.AuthenticatedUser is null)
		{
			throw new ArgumentException("User not found");
		}
		var item = await itemsRepository.GetItemByGuidAsync(guid, cancellationToken).ConfigureAwait(false);
		if (item is null || item.WishlistId != wishlistId)
		{
			throw new ArgumentException("Item not found");
		}
		
		item.BuyerIds.Add(authenticationDataProvider.AuthenticatedUser.Id);
		
		await itemsRepository.UpdateItemAsync(item, cancellationToken).ConfigureAwait(false);
	}

	public async Task UnpickItemAsync(Guid wishlistId, Guid guid, CancellationToken cancellationToken = default)
	{
		if (authenticationDataProvider.AuthenticatedUser is null)
		{
			throw new ArgumentException("User not found");
		}
		var item = await itemsRepository.GetItemByGuidAsync(guid, cancellationToken).ConfigureAwait(false);
		if (item is null || item.WishlistId != wishlistId)
		{
			throw new ArgumentException("Item not found");
		}
		
		item.BuyerIds.Remove(authenticationDataProvider.AuthenticatedUser.Id);
		
		await itemsRepository.UpdateItemAsync(item, cancellationToken).ConfigureAwait(false);
	}
}
