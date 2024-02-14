using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Services.Contracts;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class UserController(IUserService userService): ControllerBase
{
	[HttpPost]
	public async Task<IActionResult> CreateAsync(User user, CancellationToken cancellationToken = default)
	{
		await userService.CreateAsync(user, cancellationToken);
		return Ok();
	}
}
