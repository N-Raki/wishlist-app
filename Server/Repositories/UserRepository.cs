using Server.Models;
using Server.Repositories.Contracts;

namespace Server.Repositories;

internal sealed class UserRepository(DatabaseContext databaseContext) : IUserRepository
{
	public async Task CreateAsync(User user, CancellationToken cancellationToken = default)
	{
		await databaseContext.Users.AddAsync(user, cancellationToken);
		await databaseContext.SaveChangesAsync(cancellationToken);
	}
}
