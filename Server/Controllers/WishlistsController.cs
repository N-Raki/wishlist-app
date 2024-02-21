using Microsoft.AspNetCore.Mvc;
using Server.Services.Contracts;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class WishlistsController(ILogger<WishlistsController> logger, IWishlistsService wishlistsService): ControllerBase
{
	[HttpGet("{guid:guid}")]
	public async Task<IActionResult> GetWishlist(Guid guid)
	{
		var wishlist = await wishlistsService.GetWishlistByGuidAsync(guid, HttpContext.RequestAborted).ConfigureAwait(false);
		if (wishlist is null)
		{
			logger.LogWarning("Wishlist with guid {Guid} not found", guid);
			return BadRequest();
		}
		
		return Ok(wishlist);
	}
}
