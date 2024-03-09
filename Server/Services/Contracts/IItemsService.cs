using Server.Models;
using Server.Models.Requests;

namespace Server.Services.Contracts;

public interface IItemsService
{
	Task<Item?> GetItemByGuidAsync(Guid guid, CancellationToken cancellationToken = default);
	Task<Item> CreateItemAsync(Guid wishlistId, CreateItemRequest request, CancellationToken cancellationToken = default);
	Task UpdateItemAsync(Guid wishlistId, Guid guid, CreateItemRequest request, CancellationToken cancellationToken = default);
	Task DeleteItemByGuidAsync(Guid wishlistId, Guid guid, CancellationToken cancellationToken = default);
	Task PickItemAsync(Guid wishlistId, Guid guid, CancellationToken cancellationToken = default);
}
