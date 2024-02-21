using Server.Models;

namespace Server.Services.Contracts;

public interface IUsersService
{
	Task<User?> GetUserByGuidAsync(Guid guid, CancellationToken cancellationToken = default);
}
