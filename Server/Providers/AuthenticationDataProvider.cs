using System.Security.Claims;
using Server.Models;
using Server.Providers.Contracts;

namespace Server.Providers;

internal sealed class AuthenticationDataProvider(IHttpContextAccessor httpContextAccessor) : IAuthenticationDataProvider
{
	private User? _authenticatedUser;
	public User? AuthenticatedUser
	{
		get
		{
			_authenticatedUser ??= GetAuthenticatedUser();
			return _authenticatedUser;
		}
	}
	
	private User? GetAuthenticatedUser()
	{
		var user = httpContextAccessor.HttpContext?.User;
		var guid = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (guid == null)
		{
			return null;
		}
		
		return new User
		{
			Id = Guid.Parse(guid)
		};
	}
}
