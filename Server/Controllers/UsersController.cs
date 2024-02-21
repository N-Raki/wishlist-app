using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Services.Contracts;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class UsersController(ILogger<UsersController> logger, IUsersService usersService) : ControllerBase
{
	[HttpGet("me")]
	public async Task<IActionResult> GetMe()
	{
		var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
		if (userId is null)
		{
			logger.LogError("User ID is null");
			return BadRequest();
		}
		
		var guid = Guid.Parse(userId);
		var user = await usersService.GetUserByGuidAsync(guid, HttpContext.RequestAborted).ConfigureAwait(false);
		if (user is null)
		{
			logger.LogError("User with id {Id} not found", guid);
			return BadRequest();
		}
		
		return Ok(user);
	}
}
