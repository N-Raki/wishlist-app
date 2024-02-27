using Server.Models;

namespace Server.Repositories.Contracts;

public interface IItemsRepository
{
	Task<Item?> GetItemByGuidAsync(Guid guid, CancellationToken cancellationToken = default);
	Task<Item> CreateItemAsync(Item item, CancellationToken cancellationToken = default);
	Task DeleteItemAsync(Item item, CancellationToken cancellationToken = default);
}
