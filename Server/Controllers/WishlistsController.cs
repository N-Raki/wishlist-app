using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Common;
using Server.Mappers.Contracts;
using Server.Models.Requests;
using Server.Services.Contracts;

namespace Server.Controllers;

[ApiController]
[Route(Routes.Wishlists)]
[Authorize]
public sealed class WishlistsController(ILogger<WishlistsController> logger, IWishlistsService wishlistsService, IWishlistMapper wishlistMapper): ControllerBase
{
	[HttpGet("{wishlistId:guid}")]
	public async Task<IActionResult> GetWishlist([FromRoute] Guid wishlistId)
	{
		var wishlist = await wishlistsService.GetWishlistByGuidAsync(wishlistId, HttpContext.RequestAborted).ConfigureAwait(false);
		if (wishlist == null)
		{
			logger.LogWarning("Wishlist with guid {Guid} not found", wishlistId);
			return NotFound();
		}
		
		return Ok(wishlistMapper.MapToResponse(wishlist));
	}
	
	[HttpPost]
	public async Task<IActionResult> CreateWishlist([FromBody] CreateWishlistRequest createWishlistRequest)
	{
		var wishlist = await wishlistsService.CreateWishlistAsync(createWishlistRequest, HttpContext.RequestAborted).ConfigureAwait(false);
		return CreatedAtAction(nameof(GetWishlist), new { wishlistId = wishlist.Id }, wishlist);
	}
	
	[HttpDelete("{wishlistId:guid}")]
	public async Task<IActionResult> DeleteWishlist([FromRoute] Guid wishlistId)
	{
		try
		{
			await wishlistsService.DeleteWishlistByGuidAsync(wishlistId, HttpContext.RequestAborted).ConfigureAwait(false);
			return NoContent();
		}
		catch (ArgumentException)
		{
			return NotFound();
		}
	}
}
