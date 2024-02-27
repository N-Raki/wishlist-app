using Server.Models;

namespace Server.Providers.Contracts;

public interface IAuthenticationDataProvider
{
	User AuthenticatedUser { get; }
}
