using Server.Models;
using Server.Repositories.Contracts;

namespace Server.Repositories;

internal sealed class ItemsRepository(DatabaseContext databaseContext) : IItemsRepository
{
	public async Task<Item?> GetItemByGuidAsync(Guid guid, CancellationToken cancellationToken = default)
	{
		return await databaseContext.Items.FindAsync([guid], cancellationToken: cancellationToken).ConfigureAwait(false);
	}

	public async Task<Item> CreateItemAsync(Item item, CancellationToken cancellationToken = default)
	{
		databaseContext.Items.Add(item);
		await databaseContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
		return item;
	}

	public async Task DeleteItemAsync(Item item, CancellationToken cancellationToken = default)
	{
		databaseContext.Items.Remove(item);
		await databaseContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
	}
}
